"""
Tone presets module for AutoType.
This module handles predefined tone presets for text adjustment.
"""

from typing import Dict, List, Any
from .analyzer import adjust_tone


def get_tone_presets() -> List[Dict[str, Any]]:
    """
    Get a list of available tone presets.
    
    Returns:
        List of preset information dictionaries
    """
    return [
        {
            "id": "academic",
            "name": "Academic/Formal",
            "description": "Scholarly and rigorous tone suitable for academic papers",
            "formality_level": 5,
            "technical_level": 4
        },
        {
            "id": "casual",
            "name": "Casual/Conversational",
            "description": "Relaxed and friendly tone for informal communication",
            "formality_level": 1,
            "technical_level": 2
        },
        {
            "id": "professional",
            "name": "Professional/Business",
            "description": "Polished and respectful tone for business communication",
            "formality_level": 4,
            "technical_level": 3
        },
        {
            "id": "technical",
            "name": "Technical/Scientific",
            "description": "Precise and detailed tone for technical documentation",
            "formality_level": 3,
            "technical_level": 5
        },
        {
            "id": "creative",
            "name": "Creative/Narrative",
            "description": "Expressive and vivid tone for storytelling",
            "formality_level": 2,
            "technical_level": 1
        }
    ]


def get_preset_by_id(preset_id: str) -> Dict[str, Any]:
    """
    Get a preset by its ID.
    
    Args:
        preset_id: The ID of the preset to get
    
    Returns:
        Preset information dictionary
    
    Raises:
        ValueError: If the preset ID is not found
    """
    presets = get_tone_presets()
    
    for preset in presets:
        if preset["id"] == preset_id:
            return preset
    
    raise ValueError(f"Preset with ID '{preset_id}' not found")


def apply_tone_preset(text: str, preset_id: str) -> str:
    """
    Apply a tone preset to the given text.
    
    Args:
        text: The text to adjust
        preset_id: The ID of the preset to apply
    
    Returns:
        The adjusted text
    
    Raises:
        ValueError: If the preset ID is not found
    """
    # Get the preset
    preset = get_preset_by_id(preset_id)
    
    # Apply the tone adjustment
    return adjust_tone(text, preset["formality_level"], preset["technical_level"])


def get_preset_examples() -> Dict[str, str]:
    """
    Get example texts for each preset.
    
    Returns:
        Dictionary mapping preset IDs to example texts
    """
    return {
        "academic": (
            "The research methodology employed a mixed-methods approach, "
            "incorporating both qualitative and quantitative data analysis. "
            "The findings suggest a statistically significant correlation "
            "between the variables under examination, though further research "
            "is warranted to establish causality."
        ),
        
        "casual": (
            "Hey, I just wanted to let you know that I tried that new app "
            "you mentioned, and it's actually pretty cool! The interface is "
            "super easy to use, and I was able to figure everything out "
            "without any trouble. Thanks for the recommendation!"
        ),
        
        "professional": (
            "Thank you for your inquiry regarding our services. We would be "
            "pleased to schedule a meeting to discuss your requirements in "
            "detail. Please let me know your availability for next week, and "
            "I will arrange a suitable time for our discussion."
        ),
        
        "technical": (
            "The system implements a multi-threaded architecture with an "
            "asynchronous event processing pipeline. API requests are handled "
            "by worker threads from a connection pool, while database operations "
            "utilize prepared statements to mitigate SQL injection vulnerabilities."
        ),
        
        "creative": (
            "The rain danced upon the windowpane, each droplet a tiny drummer "
            "in nature's symphony. Outside, the world transformed into a canvas "
            "of blues and grays, while inside, the gentle rhythm beckoned me "
            "to dreams of distant shores and adventures yet to unfold."
        )
    } 