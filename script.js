
// Function to get nutritional information of the specified food item
async function getNutritionInfo() {
    const apiKey = 'peOKlehaBxDEZTi0zccGY0nIoY1f7XmH2ta0WXaz';
    const food = document.getElementById('food-item').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value;
    const quantityInGrams = unit === 'kilograms' ? quantity * 1000 : quantity;
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&pageSize=1&api_key=${apiKey}`;

    try {
        const searchResponse = await fetch(searchUrl);
        if (searchResponse.status === 200) {
            const searchData = await searchResponse.json();
            if (searchData.foods.length > 0) {
                const foodData = searchData.foods[0];
                const nutrients = foodData.foodNutrients;

                // Define nutrient categories
                const macroNutrients = ['Energy', 'Protein', 'Carbohydrate, by difference', 'Total lipid (fat)', 'Fiber, total dietary', 'Water', 'Fatty acids, total polyunsaturated'];
                const vitamins = ['Vitamin A, RAE', 'Thiamin', 'Riboflavin', 'Niacin', 'Pantothenic acid', 'Vitamin B-6', 'Vitamin B-12', 'Vitamin C, total ascorbic acid', 'Vitamin D (D2 + D3)', 'Vitamin E (alpha-tocopherol)', 'Vitamin K (phylloquinone)'];
                const minerals = ['Calcium, Ca', 'Iron, Fe', 'Magnesium, Mg', 'Phosphorus, P', 'Potassium, K', 'Sodium, Na', 'Zinc, Zn'];

                // Filter nutrients by category and present in the food item
                const selectedNutrients = nutrients.filter(nutrient => 
                    (macroNutrients.includes(nutrient.nutrientName) || vitamins.includes(nutrient.nutrientName) || minerals.includes(nutrient.nutrientName)) && nutrient.value > 0
                );

                // Generate nutritional information
                const nutritionInfo = selectedNutrients.map(nutrient => {
                    return `<p>${nutrient.nutrientName}: ${(nutrient.value * (quantityInGrams / 100)).toFixed(2)} ${nutrient.unitName}</p>`;
                }).join('');

                document.getElementById('nutrition-info').innerHTML =nutritionInfo;

                const spokenText = selectedNutrients.map(nutrient => {
                    return `${nutrient.nutrientName}: ${(nutrient.value * (quantityInGrams / 100)).toFixed(2)} ${nutrient.unitName}`;
                }).join(', ');

                speakText(spokenText);
            } else {
                handleError("Food not found.");
            }
        } else {
            handleError("API issue.");
        }
    } catch (error) {
        console.error('Error:', error);
        handleError("An error occurred.");
    }
}

// Function to handle errors and display them to the user
function handleError(message) {
    document.getElementById('nutrition-info').innerHTML = '<h2>Nutrition</h2>' + message;
    speakText(message);
}

// Function to start speech recognition for food item input
function startRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('food-item').value = transcript;
        getNutritionInfo();
        if (transcript.toLowerCase().includes("thank you")) {
            speakText("You're welcome!");
            document.getElementById('chatbot-response').innerText = "You're welcome!";
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.start();
}

// Function to speak the provided text
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

// Function to respond to user input
function respondToUser() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    let response = "I'm here to help with anything else you need.";

    if (userInput.includes("thank you")) {
        response = "You're welcome!";
    }

    document.getElementById('chatbot-response').innerText = response;
    speakText(response);
}

function resetFields() {
    document.getElementById('food-item').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unit').value = 'grams';
    document.getElementById('nutrition-info').innerHTML = '';
    document.getElementById('user-input').value = '';
    document.getElementById('chatbot-response').innerHTML = '';
}

// Function to stop speech synthesis
function stopSpeech() {
    window.speechSynthesis.cancel();
}

function showContainer(containerId) {
    document.getElementById('container1').style.display = 'none';
    document.getElementById('container2').style.display = 'none';
    document.getElementById('container3').style.display = 'none';
    document.getElementById(containerId).style.display = 'block';
}

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyChbvAVHzDdijZkoD4wDKU7KTQPPDjdOCE";

// Function to send user message and get bot response
async function sendMessage() {
  // Get user message
  const userMessage = document.getElementById("chat").value;

  // Display user message in chatbot-response div
  const responseDiv = document.getElementById("bot response");
  responseDiv.innerHTML += `<p>You: ${userMessage}</p>`;
  if (userMessage.toLowerCase().match("(tell me about yourself|about yourself|who are you|who r u)")) {
    const res=`I am a nutrition chatbot, designed to provide you with accurate and reliable information 
    about the nutritional content of various food items.
    My knowledge base includes a wide range of food items, from fruits and vegetables to meats and dairy products.
    I can provide information on the macro nutrients (carbohydrates, proteins, and fats) and 
    micro nutrients (vitamins and minerals) present in each food item.`;
    responseDiv.innerHTML +=`<p>Bot:${res}</p>`;
    speakText(res);
    document.getElementById("chat").value = "";
  }
  else if(userMessage.toLowerCase().match("(who developed you|you developed by whom|who developed u)"))
  {
    const res=`I'm a nutrition chatbot, carefully crafted and trained by a group of students 
    who are passionate about health and wellness.`;
    responseDiv.innerHTML +=`<p>Bot:${res}</p>`;
    speakText(res);
    document.getElementById("chat").value = "";
  }
  // Check if user message includes the word "info"
  else if (userMessage.toLowerCase().includes("info")) {
    const res=`Please click the "Go" button to get nutritional information.`
    // Provide specific bot response
    responseDiv.innerHTML += `<p>Bot:${res}</p>`;
    speakText(res);
    
    // Enable "Go" button
    document.getElementById("go-button").disabled = false;
    // Clear user message input field
    document.getElementById("chat").value = "";
  } 
  else {
    // Create JSON payload for API request
    const payload = {
      "contents": [
        {
          "parts": [
            {
              "text": userMessage
            }
          ]
        }
      ]
    };

    // Set API request options
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };

    try {
      // Send API request and get response
      const response = await fetch(Api_Url, requestOptions);
      const data = await response.json();

      // Get bot response from API data
      const botResponse = data.candidates[0].content.parts[0].text;

      // Display bot response in chatbot-response div
      responseDiv.innerHTML += `<p>Bot: ${botResponse}</p>`;
      speakText(botResponse);

      // Clear user message input field
      document.getElementById("chat").value = "";
    } catch (error) {
      console.error(error);
    }
  }
}
function resetChat() {
    document.getElementById("chat").value = "";
    document.getElementById("bot response").innerHTML = "";
    document.getElementById("go-button").disabled = true;
}
function speechRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('chat').value = transcript;
      sendMessage();
  };

  recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
  };

  recognition.start();
}
    