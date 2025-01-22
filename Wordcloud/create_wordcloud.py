import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

# Read the text file
with open('Wordcloud/Projects_abstracts.txt', 'r', encoding='utf-8') as file:
    text = file.read()

# Tokenize the text
tokens = word_tokenize(text)

# Convert to lowercase
tokens = [word.lower() for word in tokens]

# Remove stopwords and non-alphabetic tokens
stop_words = set(stopwords.words('english'))
tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

# Lemmatize the tokens
lemmatizer = WordNetLemmatizer()
lemmatized_tokens = [lemmatizer.lemmatize(word) for word in tokens]

# Join the tokens back into a single string
processed_text = ' '.join(lemmatized_tokens)

# Create and generate a word cloud image
wordcloud = WordCloud(width=1600, height=800, 
                     background_color='white',
                     min_font_size=10).generate(processed_text)

# Display the word cloud
plt.figure(figsize=(20,10))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')
plt.tight_layout(pad=0)

# Save the wordcloud
plt.savefig('Wordcloud/wordcloud.png', dpi=300, bbox_inches='tight')
plt.close() 