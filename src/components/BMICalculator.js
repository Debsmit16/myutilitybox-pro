import React, { useState, useEffect } from 'react';
import './BMICalculator.css';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [idealWeight, setIdealWeight] = useState({ min: 0, max: 0 });

  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit, age, gender]);

  const calculateBMI = () => {
    if (!height || !weight) {
      setBmi(0);
      setCategory('');
      setRecommendations([]);
      setIdealWeight({ min: 0, max: 0 });
      return;
    }

    let heightInMeters, weightInKg;

    if (unit === 'metric') {
      heightInMeters = parseFloat(height) / 100; // cm to meters
      weightInKg = parseFloat(weight);
    } else {
      heightInMeters = (parseFloat(height) * 2.54) / 100; // inches to meters
      weightInKg = parseFloat(weight) * 0.453592; // pounds to kg
    }

    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI);

    // Calculate ideal weight range
    const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);
    
    if (unit === 'imperial') {
      setIdealWeight({
        min: minIdealWeight / 0.453592, // kg to pounds
        max: maxIdealWeight / 0.453592
      });
    } else {
      setIdealWeight({
        min: minIdealWeight,
        max: maxIdealWeight
      });
    }

    // Determine category and recommendations
    const { category: bmiCategory, recommendations: bmiRecommendations } = getBMICategory(calculatedBMI, age, gender);
    setCategory(bmiCategory);
    setRecommendations(bmiRecommendations);
  };

  const getBMICategory = (bmiValue, userAge, userGender) => {
    let category = '';
    let recommendations = [];

    if (bmiValue < 18.5) {
      category = 'Underweight';
      recommendations = [
        'Consult with a healthcare provider about healthy weight gain',
        'Focus on nutrient-dense, calorie-rich foods',
        'Consider strength training to build muscle mass',
        'Eat frequent, smaller meals throughout the day',
        'Include healthy fats like nuts, avocados, and olive oil'
      ];
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = 'Normal weight';
      recommendations = [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity (150 min/week)',
        'Eat a balanced diet with fruits, vegetables, and whole grains',
        'Stay hydrated and get adequate sleep',
        'Regular health check-ups to monitor overall wellness'
      ];
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = 'Overweight';
      recommendations = [
        'Aim for gradual weight loss (1-2 pounds per week)',
        'Increase physical activity to 300 minutes per week',
        'Focus on portion control and mindful eating',
        'Reduce processed foods and added sugars',
        'Consider consulting a nutritionist for personalized advice'
      ];
    } else {
      category = 'Obese';
      recommendations = [
        'Consult with healthcare providers for a comprehensive plan',
        'Set realistic, achievable weight loss goals',
        'Combine cardiovascular and strength training exercises',
        'Consider working with a registered dietitian',
        'Focus on sustainable lifestyle changes, not quick fixes'
      ];
    }

    return { category, recommendations };
  };

  const getBMIColor = (bmiValue) => {
    if (bmiValue < 18.5) return '#3498db'; // Blue for underweight
    if (bmiValue < 25) return '#27ae60'; // Green for normal
    if (bmiValue < 30) return '#f39c12'; // Orange for overweight
    return '#e74c3c'; // Red for obese
  };

  const formatWeight = (weightValue) => {
    return unit === 'metric' ? `${weightValue.toFixed(1)} kg` : `${weightValue.toFixed(1)} lbs`;
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setBmi(0);
    setCategory('');
    setRecommendations([]);
    setIdealWeight({ min: 0, max: 0 });
  };

  const getBMIProgress = () => {
    // Map BMI to position on scale (0-100%)
    if (bmi < 18.5) return (bmi / 18.5) * 25; // 0-25% for underweight
    if (bmi < 25) return 25 + ((bmi - 18.5) / (25 - 18.5)) * 25; // 25-50% for normal
    if (bmi < 30) return 50 + ((bmi - 25) / (30 - 25)) * 25; // 50-75% for overweight
    return 75 + Math.min(((bmi - 30) / 10) * 25, 25); // 75-100% for obese
  };

  return (
    <div className="bmi-calculator">
      {/* Header */}
      <div className="bmi-header">
        <div className="header-left">
          <h2>🏃‍♂️ BMI Calculator</h2>
          {bmi > 0 && (
            <div className="bmi-badge" style={{ backgroundColor: getBMIColor(bmi) }}>
              BMI: {bmi.toFixed(1)}
            </div>
          )}
        </div>
        <div className="header-actions">
          <button onClick={resetCalculator} className="reset-btn">
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="bmi-content">
        {/* Input Section */}
        <div className="input-section">
          <h4>Personal Information</h4>
          
          {/* Unit Selection */}
          <div className="unit-selector">
            <button
              onClick={() => setUnit('metric')}
              className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
            >
              Metric (cm/kg)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
            >
              Imperial (ft/lbs)
            </button>
          </div>

          <div className="input-grid">
            {/* Height */}
            <div className="input-group">
              <label>Height</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unit === 'metric' ? '170' : '68'}
                  className="measurement-input"
                />
                <span className="unit-label">
                  {unit === 'metric' ? 'cm' : 'inches'}
                </span>
              </div>
            </div>

            {/* Weight */}
            <div className="input-group">
              <label>Weight</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === 'metric' ? '70' : '154'}
                  className="measurement-input"
                />
                <span className="unit-label">
                  {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>

            {/* Age */}
            <div className="input-group">
              <label>Age</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="measurement-input"
                  min="1"
                  max="120"
                />
                <span className="unit-label">years</span>
              </div>
            </div>

            {/* Gender */}
            <div className="input-group">
              <label>Gender</label>
              <div className="gender-selector">
                <button
                  onClick={() => setGender('male')}
                  className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                >
                  👨 Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                >
                  👩 Female
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {bmi > 0 && (
          <div className="results-section">
            <h4>Your BMI Results</h4>
            
            <div className="bmi-display">
              <div className="bmi-circle" style={{ borderColor: getBMIColor(bmi) }}>
                <div className="bmi-value">{bmi.toFixed(1)}</div>
                <div className="bmi-category" style={{ color: getBMIColor(bmi) }}>
                  {category}
                </div>
              </div>
              
              <div className="bmi-scale">
                <div className="scale-bar">
                  <div 
                    className="scale-indicator" 
                    style={{ 
                      left: `${getBMIProgress()}%`,
                      backgroundColor: getBMIColor(bmi)
                    }}
                  ></div>
                </div>
                <div className="scale-labels">
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
              </div>
            </div>

            <div className="weight-info">
              <div className="info-card">
                <h5>Ideal Weight Range</h5>
                <p>{formatWeight(idealWeight.min)} - {formatWeight(idealWeight.max)}</p>
              </div>
              <div className="info-card">
                <h5>Current Status</h5>
                <p style={{ color: getBMIColor(bmi) }}>{category}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <h4>Health Recommendations</h4>
            <div className="recommendations-list">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  <span className="recommendation-icon">💡</span>
                  <span className="recommendation-text">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BMI Categories Reference */}
        <div className="categories-section">
          <h4>BMI Categories</h4>
          <div className="categories-grid">
            <div className="category-item underweight">
              <span className="category-range">Below 18.5</span>
              <span className="category-name">Underweight</span>
            </div>
            <div className="category-item normal">
              <span className="category-range">18.5 - 24.9</span>
              <span className="category-name">Normal weight</span>
            </div>
            <div className="category-item overweight">
              <span className="category-range">25.0 - 29.9</span>
              <span className="category-name">Overweight</span>
            </div>
            <div className="category-item obese">
              <span className="category-range">30.0 and above</span>
              <span className="category-name">Obese</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
