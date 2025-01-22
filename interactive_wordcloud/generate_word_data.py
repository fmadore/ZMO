import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import json
from collections import Counter

# Download necessary NLTK data packages
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

def process_text(file_path):
    # Read the input text file
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()

    # Tokenization and lowercase conversion
    tokens = word_tokenize(text.lower())

    # Remove stopwords and non-alphabetic tokens
    stop_words = set(stopwords.words('english'))
    stop_words.add('project')  # Add custom stopwords
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in tokens]

    # Count word frequencies
    word_freq = Counter(lemmatized_tokens)

    # Convert to list of objects for D3.js
    word_data = [{"text": word, "size": count} for word, count in word_freq.most_common(100)]

    # Save to JSON file
    with open('interactive_wordcloud/word_frequencies.json', 'w', encoding='utf-8') as f:
        json.dump(word_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_text('../Wordcloud/Projects_abstracts.txt') 