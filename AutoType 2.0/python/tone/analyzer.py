"""
Tone analyzer module for AutoType.
This module analyzes and adjusts the tone of text.
"""

from typing import Dict, List, Any, Tuple
import re


def analyze_tone(text: str) -> Dict[str, Any]:
    """
    Analyze the tone of the given text.
    
    Args:
        text: The text to analyze
    
    Returns:
        Dictionary with tone analysis results
    """
    # This is a placeholder that would contain actual tone analysis logic
    # In a real implementation, this would use NLP libraries or API calls
    
    # Calculate some basic metrics
    formality_score = calculate_formality(text)
    technical_level = calculate_technical_level(text)
    
    # Return analysis results
    return {
        "formality": formality_score,
        "technical_level": technical_level,
        "closest_preset": get_closest_preset(formality_score, technical_level)
    }


def calculate_formality(text: str) -> float:
    """
    Calculate the formality score of the text.
    
    Args:
        text: The text to analyze
    
    Returns:
        Formality score from 1 (informal) to 5 (formal)
    """
    # This is a placeholder that would contain actual formality calculation logic
    # For now, just do some basic checks
    
    formality_indicators = {
        r'\bI\b': -0.5,            # First person pronouns (informal)
        r'\byou\b': -0.5,          # Second person pronouns (informal)
        r'\bwe\b': -0.3,           # First person plural (somewhat informal)
        r'\bgonna\b': -1.0,        # Contractions and slang (very informal)
        r'\bwanna\b': -1.0,
        r'\bcool\b': -0.5,
        r'\bawesome\b': -0.5,
        r'\bstuff\b': -0.5,
        r'\bthing\b': -0.3,
        r'\bretains\b': 0.5,       # Formal verbs
        r'\bfacilitate\b': 0.5,
        r'\bpursuant\b': 1.0,      # Legal/formal terms
        r'\bhereby\b': 1.0,
        r'\bthus\b': 0.5,
        r'\bconsequently\b': 0.5,
        r'\bnevertheless\b': 0.5,
        r'\btherefore\b': 0.3,
    }
    
    # Start with a neutral formality (3.0)
    score = 3.0
    
    # Check for indicators
    for pattern, weight in formality_indicators.items():
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        score += matches * weight
    
    # Normalize to 1-5 range
    score = max(1.0, min(5.0, score))
    
    return score


def calculate_technical_level(text: str) -> float:
    """
    Calculate the technical level of the text.
    
    Args:
        text: The text to analyze
    
    Returns:
        Technical level score from 1 (non-technical) to 5 (highly technical)
    """
    # This is a placeholder that would contain actual technical level calculation logic
    # For now, just do some basic checks
    
    technical_indicators = {
        r'\balgorithm\b': 0.5,
        r'\bimplementation\b': 0.3,
        r'\bfunction\b': 0.3,
        r'\bmethod\b': 0.3,
        r'\bvariable\b': 0.3,
        r'\bparameter\b': 0.3,
        r'\binterface\b': 0.5,
        r'\bprotocol\b': 0.5,
        r'\bmodule\b': 0.3,
        r'\blibrary\b': 0.3,
        r'\babstraction\b': 0.5,
        r'\bencapsulation\b': 0.5,
        r'\binheritance\b': 0.5,
        r'\bpolymorphism\b': 0.5,
        r'\basynchronous\b': 0.5,
        r'\bsynchronous\b': 0.5,
        r'\bconcurrency\b': 0.5,
        r'\bparallelism\b': 0.5,
        r'\bmultithreading\b': 0.5,
        r'\barchitecture\b': 0.3,
    }
    
    # Start with a neutral technical level (3.0)
    score = 3.0
    
    # Check for indicators
    for pattern, weight in technical_indicators.items():
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        score += matches * weight
    
    # Normalize to 1-5 range
    score = max(1.0, min(5.0, score))
    
    return score


def get_closest_preset(formality: float, technical_level: float) -> str:
    """
    Get the closest tone preset based on formality and technical level.
    
    Args:
        formality: Formality score (1-5)
        technical_level: Technical level score (1-5)
    
    Returns:
        Name of the closest preset
    """
    # Preset characteristics
    presets = {
        "academic": {"formality": 5.0, "technical_level": 4.0},
        "casual": {"formality": 1.0, "technical_level": 2.0},
        "professional": {"formality": 4.0, "technical_level": 3.0},
        "technical": {"formality": 3.0, "technical_level": 5.0},
        "creative": {"formality": 2.0, "technical_level": 1.0},
    }
    
    # Find the closest preset
    closest_preset = None
    closest_distance = float('inf')
    
    for preset_name, preset_values in presets.items():
        # Calculate Euclidean distance
        distance = ((formality - preset_values["formality"]) ** 2 + 
                   (technical_level - preset_values["technical_level"]) ** 2) ** 0.5
        
        if distance < closest_distance:
            closest_distance = distance
            closest_preset = preset_name
    
    return closest_preset


def adjust_tone(text: str, target_formality: float, target_technical_level: float) -> str:
    """
    Adjust the tone of the text to match the target formality and technical level.
    
    Args:
        text: The text to adjust
        target_formality: Target formality level (1-5)
        target_technical_level: Target technical level (1-5)
    
    Returns:
        The adjusted text
    """
    # This is a placeholder that would contain actual tone adjustment logic
    # In a real implementation, this would use NLP libraries or API calls
    
    # Analyze current tone
    current_tone = analyze_tone(text)
    
    # Determine adjustments needed
    formality_change = target_formality - current_tone["formality"]
    technical_change = target_technical_level - current_tone["technical_level"]
    
    # Apply adjustments
    adjusted_text = text
    
    # Adjust formality
    if abs(formality_change) > 0.5:
        adjusted_text = adjust_formality(adjusted_text, formality_change)
    
    # Adjust technical level
    if abs(technical_change) > 0.5:
        adjusted_text = adjust_technical_level(adjusted_text, technical_change)
    
    return adjusted_text


def adjust_formality(text: str, formality_change: float) -> str:
    """
    Adjust the formality of the text.
    
    Args:
        text: The text to adjust
        formality_change: How much to change formality (positive for more formal)
    
    Returns:
        The adjusted text
    """
    # This is a placeholder that would contain actual formality adjustment logic
    # For now, just do some basic replacements
    
    if formality_change > 0:
        # Make more formal
        replacements = {
            r'\bdon\'t\b': 'do not',
            r'\bcan\'t\b': 'cannot',
            r'\bwon\'t\b': 'will not',
            r'\bI\b': 'one',
            r'\bwe\b': 'one',
            r'\byou\b': 'one',
            r'\bthing\b': 'matter',
            r'\bstuff\b': 'materials',
            r'\blot\b': 'significant amount',
            r'\bgot\b': 'obtained',
            r'\bget\b': 'obtain',
            r'\bwant\b': 'desire',
            r'\bneed\b': 'require',
            r'\buse\b': 'utilize',
            r'\bmake\b': 'create',
            r'\bshow\b': 'demonstrate',
        }
    else:
        # Make less formal
        replacements = {
            r'\butilize\b': 'use',
            r'\bobtain\b': 'get',
            r'\brequire\b': 'need',
            r'\bdesire\b': 'want',
            r'\bdemonstrate\b': 'show',
            r'\bpurchase\b': 'buy',
            r'\binform\b': 'tell',
            r'\bprovide\b': 'give',
            r'\bassist\b': 'help',
            r'\bconsider\b': 'think about',
            r'\bdiscuss\b': 'talk about',
            r'\bcommunicate\b': 'talk',
            r'\bcommence\b': 'start',
            r'\bterminate\b': 'end',
            r'\bfacilitate\b': 'help',
        }
    
    # Apply replacements
    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    return text


def adjust_technical_level(text: str, technical_change: float) -> str:
    """
    Adjust the technical level of the text.
    
    Args:
        text: The text to adjust
        technical_change: How much to change technical level (positive for more technical)
    
    Returns:
        The adjusted text
    """
    # This is a placeholder that would contain actual technical level adjustment logic
    # For now, just do some basic replacements
    
    if technical_change > 0:
        # Make more technical
        replacements = {
            r'\buse\b': 'implement',
            r'\bfix\b': 'resolve',
            r'\bfast\b': 'high-performance',
            r'\bloop\b': 'iteration',
            r'\berror\b': 'exception',
            r'\bspeed\b': 'throughput',
            r'\bsize\b': 'payload dimension',
            r'\bcheck\b': 'validate',
            r'\bsend\b': 'transmit',
            r'\bget\b': 'retrieve',
            r'\bkeep\b': 'persist',
            r'\bwait\b': 'block',
            r'\bstop\b': 'terminate',
            r'\blook at\b': 'analyze',
        }
    else:
        # Make less technical
        replacements = {
            r'\bimplementation\b': 'way it works',
            r'\bfunctionality\b': 'features',
            r'\butilization\b': 'use',
            r'\binterface\b': 'screen',
            r'\balgorithm\b': 'process',
            r'\bconfiguration\b': 'settings',
            r'\basynchronous\b': 'background',
            r'\bperformance optimization\b': 'speed improvements',
            r'\bencapsulation\b': 'grouping',
            r'\bexception handling\b': 'error checking',
            r'\brefactoring\b': 'rewriting',
            r'\bdependency\b': 'requirement',
            r'\barchitecture\b': 'design',
            r'\bparameterize\b': 'set options for',
        }
    
    # Apply replacements
    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    return text 