import os
import base64
import json
import re
from groq import Groq
from django.conf import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL  = "meta-llama/llama-4-scout-17b-16e-instruct"


def encode_image(image_path):
    with open(image_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def analyze_image(image_path):
    image_b64 = encode_image(image_path)
    ext = os.path.splitext(image_path)[1].lower()
    mime = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}.get(ext, 'image/jpeg')

    prompt = """You are an expert plant pathologist and botanist.

Look at this plant image and identify it with high accuracy:
1. IDENTIFY the exact plant species by analyzing its features (such as leaves, stems, flowers, fruit, roots, or overall structure). Provide both its scientific name and its common name, formatted exactly as: 'Scientific Name (Common Name)' (e.g., 'Solanum lycopersicum (Tomato)' or 'Malus domestica (Apple)')
2. DETECT any disease present that affects the plant, or confirm "Healthy" if none is visible or found
3. ESTIMATE your confidence (0-100)

Respond ONLY with valid JSON, no extra text:
{
    "plant_name": "<Scientific Name (Common Name)>",
    "disease_name": "<disease name or 'Healthy'>",
    "confidence": <0-100>
}

If the image is NOT a plant or plant part:
{
    "plant_name": "Unknown",
    "disease_name": "Not a plant image",
    "confidence": 0
}"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_b64}"}},
                {"type": "text", "text": prompt}
            ]
        }],
        temperature=0.1,
        max_completion_tokens=256,
        top_p=1,
        stream=False,
    )

    text = response.choices[0].message.content.strip()
    match = re.search(r'\{.*?\}', text, re.DOTALL)
    if match:
        try:
            r = json.loads(match.group())
            return {
                "plant_name":   r.get("plant_name",   "Unknown"),
                "disease_name": r.get("disease_name", "Unknown"),
                "confidence":   float(r.get("confidence", 0)),
            }
        except json.JSONDecodeError:
            pass

    return {"plant_name": "Unknown", "disease_name": "Could not analyze image", "confidence": 0.0}


def format_advisory_field(val):
    if isinstance(val, list):
        items = []
        for item in val:
            if isinstance(item, dict):
                for k, v in item.items():
                    k_title = k.replace('_', ' ').title()
                    items.append(f"• {k_title}: {v}")
            elif isinstance(item, str):
                items.append(f"• {item}")
        return "\n".join(items)
    elif isinstance(val, dict):
        items = []
        for k, v in val.items():
            k_title = k.replace('_', ' ').title()
            items.append(f"• {k_title}: {v}")
        return "\n".join(items)
    return str(val)


def generate_advisory(plant_name, disease_name):
    if plant_name == "Unknown" or disease_name in ["Not a plant image", "Not a plant leaf image", "Could not analyze image"]:
        return {
            "description":       "The image could not be identified as a plant or plant part.",
            "causes":            "Please upload a clear photo of a plant.",
            "symptoms":          "",
            "natural_remedies":  "",
            "chemical_remedies": "",
            "prevention":        "Ensure good lighting and focus on the plant or its affected part.",
        }

    healthy = 'healthy' in disease_name.lower()

    if healthy:
        prompt = f"""You are an expert agricultural scientist.
Plant: {plant_name} — Status: Healthy (No disease found)

Since no disease was found, provide a positive assessment and detailed instructions to protect the plant, boost its growth, and improve its overall health.
Respond ONLY with JSON. Ensure each value is a simple plain-text string (NOT a list/dict):
{{
    "description": "A positive description of the healthy state of the {plant_name} and general wellness assessment.",
    "causes": "Factors contributing to its good health (e.g., proper care, optimal environment) and general stressors to watch out for.",
    "symptoms": "Healthy signs to observe for normal development, and early indicators of nutrient or water stress.",
    "natural_remedies": "Detailed organic care instructions to protect the plant, boost growth, and improve soil/foliar health (e.g. composting, organic mulching, watering schedules).",
    "chemical_remedies": "Preventive maintenance tips, such as using balanced fertilizers, micronutrients, or safe protective applications to maintain peak health.",
    "prevention": "Daily/weekly best practices to protect the plant from future diseases and maximize yield/bloom quality."
}}"""
    else:
        prompt = f"""You are an expert plant pathologist.
Plant: {plant_name}
Disease: {disease_name}

Respond ONLY with JSON. Ensure each value is a simple plain-text string (NOT a list/dict):
{{
    "description": "What {disease_name} is and how it affects {plant_name}",
    "causes": "Specific pathogen or environmental cause",
    "symptoms": "Visible symptoms on leaves, stems, fruit",
    "natural_remedies": "Organic treatments with application instructions",
    "chemical_remedies": "Recommended fungicides/pesticides with active ingredients",
    "prevention": "Steps to prevent this disease in future seasons"
}}"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert agricultural scientist. Respond with valid JSON only."},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.3,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
    )

    text = response.choices[0].message.content.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)

    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            a = json.loads(match.group())
            return {
                "description":       format_advisory_field(a.get("description",       "")),
                "causes":            format_advisory_field(a.get("causes",            "")),
                "symptoms":          format_advisory_field(a.get("symptoms",          "")),
                "natural_remedies":  format_advisory_field(a.get("natural_remedies",  "")),
                "chemical_remedies": format_advisory_field(a.get("chemical_remedies", "")),
                "prevention":        format_advisory_field(a.get("prevention",        "")),
            }
        except json.JSONDecodeError:
            pass

    return {
        "description":       text,
        "causes":            "Try again for detailed advisory.",
        "symptoms":          "",
        "natural_remedies":  "",
        "chemical_remedies": "",
        "prevention":        "",
    }
