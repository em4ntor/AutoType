"""
Plagiarism checker module for AutoType.
This module handles the detection of potentially plagiarized content.
"""

import re
import random
from typing import Dict, List, Any, Tuple


def check_plagiarism(text: str) -> Dict[str, Any]:
    """
    Check text for potential plagiarism.
    
    Args:
        text: The text to check
    
    Returns:
        Dictionary with plagiarism check results
    """
    # This is a placeholder that would contain actual plagiarism checking logic
    # In a real implementation, this would use APIs or databases to check against online sources
    
    # For demonstration, simulate finding plagiarism in certain phrases
    results = simulate_plagiarism_check(text)
    
    return results


def simulate_plagiarism_check(text: str) -> Dict[str, Any]:
    """
    Simulate a plagiarism check for demonstration purposes.
    
    Args:
        text: The text to check
    
    Returns:
        Dictionary with simulated plagiarism check results
    """
    # Split the text into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    # Randomly mark some sentences as potentially plagiarized
    sources = []
    plagiarized_segments = []
    total_similarity_score = 0.0
    
    # Common phrases that might trigger plagiarism detection
    common_phrases = [
        "in conclusion",
        "as a result",
        "according to",
        "research has shown",
        "studies indicate",
        "it is clear that",
        "due to the fact that",
        "in light of",
        "based on the findings",
        "it should be noted",
    ]
    
    # Check each sentence
    for i, sentence in enumerate(sentences):
        # Convert to lowercase for checking
        sentence_lower = sentence.lower()
        
        # Check if sentence contains any common phrases
        for phrase in common_phrases:
            if phrase in sentence_lower:
                # Simulate finding this in a source
                similarity = random.uniform(0.6, 0.9)
                
                # Only count it sometimes
                if random.random() < 0.7:
                    source_id = len(sources) + 1
                    domain = random.choice(["example.com", "academia.edu", "scholar.org", "papers.edu", "research.net"])
                    path = random.choice(["article", "paper", "research", "publication", "journal"]) + str(random.randint(1, 1000))
                    
                    source = {
                        "id": source_id,
                        "url": f"https://www.{domain}/{path}",
                        "title": f"Publication on {path.capitalize()}",
                        "similarity": similarity,
                        "matchedText": sentence
                    }
                    
                    sources.append(source)
                    plagiarized_segments.append((i, similarity))
                    
                    # Increase the total similarity score
                    total_similarity_score += (similarity * len(sentence)) / len(text)
                    
                    # Only match one phrase per sentence
                    break
    
    # Generate highlighted text
    highlighted_text = generate_highlighted_text(sentences, plagiarized_segments)
    
    # Ensure the similarity score is between 0 and 1
    total_similarity_score = min(0.95, total_similarity_score)
    
    return {
        "similarityScore": total_similarity_score,
        "sources": sources,
        "highlightedText": highlighted_text
    }


def generate_highlighted_text(sentences: List[str], plagiarized_segments: List[Tuple[int, float]]) -> str:
    """
    Generate HTML text with plagiarized segments highlighted.
    
    Args:
        sentences: List of sentences in the text
        plagiarized_segments: List of tuples with (sentence_index, similarity)
    
    Returns:
        HTML string with highlighted plagiarized segments
    """
    # Convert plagiarized segments to a set for quick lookup
    plagiarized_indices = {index for index, _ in plagiarized_segments}
    
    # Build the HTML
    html = "<p>"
    
    for i, sentence in enumerate(sentences):
        if i in plagiarized_indices:
            # Highlight the plagiarized sentence
            html += f'<span class="plagiarism-highlight">{sentence}</span> '
        else:
            # Regular sentence
            html += f'{sentence} '
    
    html += "</p>"
    
    return html


def get_matched_sources(text: str, plagiarized_segments: List[Tuple[int, float]]) -> List[Dict[str, Any]]:
    """
    Get information about matched sources for plagiarized segments.
    
    Args:
        text: The original text
        plagiarized_segments: List of tuples with (sentence_index, similarity)
    
    Returns:
        List of source information dictionaries
    """
    # This is a placeholder that would contain actual source retrieval logic
    # For now, just generate fake sources
    
    sources = []
    for i, (segment_index, similarity) in enumerate(plagiarized_segments):
        source_id = i + 1
        domain = random.choice(["example.com", "academia.edu", "scholar.org", "papers.edu", "research.net"])
        path = random.choice(["article", "paper", "research", "publication", "journal"]) + str(random.randint(1, 1000))
        
        source = {
            "id": source_id,
            "url": f"https://www.{domain}/{path}",
            "title": f"Publication on {path.capitalize()}",
            "similarity": similarity,
            "matchedText": text.split('.')[segment_index] if segment_index < len(text.split('.')) else ""
        }
        
        sources.append(source)
    
    return sources 