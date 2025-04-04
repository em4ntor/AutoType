"""
Vocabulary module for AutoType's text humanization.
This module handles adjusting vocabulary complexity and adding filler words.
"""

import random
import re
from typing import List, Dict, Tuple, Optional


def adjust_vocabulary(text: str, level: int = 3, add_fillers: bool = False) -> str:
    """
    Adjust the vocabulary complexity of the text.
    
    Args:
        text: The text to adjust
        level: Complexity level from 1 (simple) to 5 (complex)
        add_fillers: Whether to add filler words
    
    Returns:
        The adjusted text
    """
    # Process the text
    if level < 3:
        text = simplify_vocabulary(text, 3 - level)
    elif level > 3:
        text = enhance_vocabulary(text, level - 3)
    
    # Add filler words if requested
    if add_fillers:
        text = add_filler_words(text)
    
    return text


def simplify_vocabulary(text: str, degree: int = 1) -> str:
    """
    Simplify the vocabulary in the text.
    
    Args:
        text: The text to simplify
        degree: Degree of simplification (1 or 2)
    
    Returns:
        The simplified text
    """
    # This is a placeholder that would contain actual vocabulary simplification logic
    # For now, just do some basic replacements
    
    # Define word replacements based on simplification degree
    replacements = get_simplification_replacements(degree)
    
    # Apply replacements
    for complex_word, simple_word in replacements.items():
        # Use word boundary regex to only replace whole words
        pattern = r'\b' + re.escape(complex_word) + r'\b'
        text = re.sub(pattern, simple_word, text, flags=re.IGNORECASE)
    
    return text


def enhance_vocabulary(text: str, degree: int = 1) -> str:
    """
    Enhance the vocabulary in the text to be more complex.
    
    Args:
        text: The text to enhance
        degree: Degree of enhancement (1 or 2)
    
    Returns:
        The enhanced text
    """
    # This is a placeholder that would contain actual vocabulary enhancement logic
    # For now, just do some basic replacements
    
    # Define word replacements based on enhancement degree
    replacements = get_enhancement_replacements(degree)
    
    # Apply replacements
    for simple_word, complex_word in replacements.items():
        # Use word boundary regex to only replace whole words
        pattern = r'\b' + re.escape(simple_word) + r'\b'
        text = re.sub(pattern, complex_word, text, flags=re.IGNORECASE)
    
    return text


def add_filler_words(text: str) -> str:
    """
    Add filler words to the text to make it more human-like.
    
    Args:
        text: The text to modify
    
    Returns:
        The text with filler words added
    """
    # This is a placeholder that would contain actual filler word logic
    # For now, just add some basic fillers
    
    # Split the text into sentences
    sentences = text.split('. ')
    
    # Process each sentence
    for i in range(len(sentences)):
        # Only add fillers to some sentences
        if random.random() < 0.3:
            # Choose a filler to add
            filler = random.choice(get_filler_words())
            
            # Add it at the beginning or middle of the sentence
            words = sentences[i].split()
            if len(words) > 3 and random.random() < 0.5:
                # Add in the middle
                insert_pos = random.randint(1, len(words) - 1)
                words.insert(insert_pos, filler)
                sentences[i] = ' '.join(words)
            else:
                # Add at the beginning
                sentences[i] = filler + ' ' + sentences[i]
    
    # Join the sentences back together
    return '. '.join(sentences)


def get_simplification_replacements(degree: int) -> Dict[str, str]:
    """
    Get word replacements for simplification.
    
    Args:
        degree: Degree of simplification (1 or 2)
    
    Returns:
        Dictionary of complex words to simple words
    """
    # Basic replacements
    replacements = {
        'utilize': 'use',
        'implement': 'use',
        'obtain': 'get',
        'acquire': 'get',
        'sufficient': 'enough',
        'commence': 'start',
        'terminate': 'end',
        'additional': 'more',
        'subsequently': 'later',
        'nevertheless': 'still',
        'facilitate': 'help',
        'demonstrate': 'show',
        'ascertain': 'find out',
        'constitutes': 'is',
        'endeavor': 'try',
    }
    
    # Add more aggressive replacements for higher degree
    if degree > 1:
        additional = {
            'approximately': 'about',
            'excessive': 'too much',
            'inquire': 'ask',
            'perceive': 'see',
            'comprehend': 'understand',
            'encountered': 'met',
            'prioritize': 'focus on',
            'conclusion': 'end',
            'initiate': 'start',
            'illustrate': 'show',
        }
        replacements.update(additional)
    
    return replacements


def get_enhancement_replacements(degree: int) -> Dict[str, str]:
    """
    Get word replacements for enhancement.
    
    Args:
        degree: Degree of enhancement (1 or 2)
    
    Returns:
        Dictionary of simple words to complex words
    """
    # Basic replacements
    replacements = {
        'use': 'utilize',
        'get': 'acquire',
        'enough': 'sufficient',
        'start': 'commence',
        'end': 'terminate',
        'more': 'additional',
        'later': 'subsequently',
        'still': 'nevertheless',
        'help': 'facilitate',
        'show': 'demonstrate',
        'find out': 'ascertain',
        'is': 'constitutes',
        'try': 'endeavor',
    }
    
    # Add more aggressive replacements for higher degree
    if degree > 1:
        additional = {
            'about': 'approximately',
            'too much': 'excessive',
            'ask': 'inquire',
            'see': 'perceive',
            'understand': 'comprehend',
            'met': 'encountered',
            'focus on': 'prioritize',
            'end': 'conclusion',
            'start': 'initiate',
            'show': 'illustrate',
        }
        replacements.update(additional)
    
    return replacements


def get_filler_words() -> List[str]:
    """
    Get a list of filler words.
    
    Returns:
        List of filler words
    """
    return [
        "basically",
        "literally",
        "actually",
        "honestly",
        "I mean",
        "you know",
        "like",
        "kind of",
        "sort of",
        "I guess",
        "well",
        "um",
        "to be honest",
        "in a way",
        "pretty much",
    ] 