import { useState, ChangeEvent } from 'react';
import { Calculator, GraduationCap, Info, Linkedin } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa6";

type EntryTestType = 'NU' | 'NAT' | 'SAT';
type EducationType = 'FSc' | 'A-Level';

interface FormData {
  matricMarks: { obtained: number; total: number };
  fscMarks: { obtained: number; total: number };
  entryTestType: EntryTestType;
  entryTestMarks: { obtained: number; total: number };
  educationType: EducationType;
}


function App() {
  const [formData, setFormData] = useState<FormData>({
    matricMarks: { obtained: 0, total: 1100 },
    fscMarks: { obtained: 0, total: 1100 },
    entryTestType: 'NU',
    entryTestMarks: { obtained: 0, total: 100 },
    educationType: 'FSc'
  });

  const [aggregate, setAggregate] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('form');

  const calculateAggregate = () => {
    const matricPercentage = (formData.matricMarks.obtained / formData.matricMarks.total) * 100;
    const fscPercentage = (formData.fscMarks.obtained / formData.fscMarks.total) * 100;
    const testPercentage = (formData.entryTestMarks.obtained / formData.entryTestMarks.total) * 100;

    let calculatedAggregate = 
      (matricPercentage * 0.1) + 
      (fscPercentage * 0.4) + 
      (testPercentage * 0.5);

    if (formData.educationType === 'A-Level') {
      calculatedAggregate *= 1.1; // 10% increase for A-Level students
    }

    setAggregate(Math.min(100, calculatedAggregate));
    setActiveSection('results');
  };

  const handleInputChange = (
    field: keyof FormData,
    subField: 'obtained' | 'total' | null,
    value: number | EntryTestType | EducationType
  ) => {
    if (subField) {
      setFormData((prev: FormData) => ({
        ...prev,
        [field]: {
          ...prev[field as keyof Pick<FormData, 'matricMarks' | 'fscMarks' | 'entryTestMarks'>],
          [subField]: value
        }
      }));
    } else {
      if (field === 'entryTestType' && value === 'SAT') {
        setFormData((prev: FormData) => ({
          ...prev,
          [field]: value,
          entryTestMarks: {
            ...prev.entryTestMarks,
            total: 1600
          }
        }));
      } else {
        setFormData((prev: FormData) => ({
          ...prev,
          [field]: value
        }));
      }
    }
  };

  // CSS to hide number input spinners
  const inputStyles = `
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <style>{inputStyles}</style>
      {/* Header */}
      <header className="bg-gray-800/90 py-4 shadow-lg backdrop-blur-sm fixed top-0 left-0 right-0 z-10 border-b border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-400 animate-bounce" />
            <h1 className="text-2xl font-bold text-center text-indigo-400">
              FAST NU Aggregate Calculator
            </h1>
          </div>
          <p className="text-center mt-2 text-gray-300 max-w-2xl mx-auto text-sm">
            Calculate your aggregate for FAST University programs using your academic and test scores
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 pt-28">
        <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-gray-700/30">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-700/50">
            <button 
              onClick={() => setActiveSection('form')} 
              className={`pb-3 px-4 font-medium transition-all ${activeSection === 'form' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Calculator
            </button>
            {aggregate !== null && (
              <button 
                onClick={() => setActiveSection('results')} 
                className={`pb-3 px-4 font-medium transition-all ${activeSection === 'results' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                Results
              </button>
            )}
          </div>

          {/* Form Section */}
          {activeSection === 'form' && (
            <div className="space-y-6">
              {/* Education Type Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Education System</label>
                <div className="flex gap-4">
                  {['FSc', 'A-Level'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleInputChange('educationType', null, type as EducationType)}
                      className={`px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
                        formData.educationType === type 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'bg-gray-700/70 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formData.educationType === 'A-Level' && (
                  <p className="text-xs text-indigo-300 italic">
                    A-Level students receive an additional 10% weightage
                  </p>
                )}
              </div>

              {/* Matric/O-Level Marks */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  {formData.educationType === 'FSc' ? 'Matric' : 'O-Level'} Marks
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Obtained"
                      value={formData.matricMarks.obtained || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('matricMarks', 'obtained', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-700/60 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 border border-gray-600/50"
                    />
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-xs">marks</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Total"
                      value={formData.matricMarks.total}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('matricMarks', 'total', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-700/60 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 border border-gray-600/50"
                    />
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-xs">total</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Contributes 10% to your aggregate score</p>
              </div>

              {/* FSc/A-Level Marks */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  {formData.educationType} Marks
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Obtained"
                      value={formData.fscMarks.obtained || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fscMarks', 'obtained', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-700/60 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 border border-gray-600/50"
                    />
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-xs">marks</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Total"
                      value={formData.fscMarks.total}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fscMarks', 'total', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-700/60 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 border border-gray-600/50"
                    />
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-xs">total</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Contributes 40% to your aggregate score</p>
              </div>

              {/* Entry Test Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Entry Test Type</label>
                <div className="flex gap-4">
                  {['NU', 'NAT', 'SAT'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleInputChange('entryTestType', null, type as EntryTestType)}
                      className={`px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
                        formData.entryTestType === type 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'bg-gray-700/70 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry Test Marks */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Entry Test Marks</label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Obtained"
                      value={formData.entryTestMarks.obtained || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('entryTestMarks', 'obtained', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-700/60 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 border border-gray-600/50"
                    />
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-xs">marks</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Total"
                      value={formData.entryTestMarks.total}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('entryTestMarks', 'total', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-700/60 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 border border-gray-600/50"
                    />
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-xs">total</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Contributes 50% to your aggregate score</p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateAggregate}
                className="w-full py-3 mt-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Calculator className="h-5 w-5" />
                Calculate Aggregate
              </button>
            </div>
          )}

          {/* Results Section */}
          {activeSection === 'results' && aggregate !== null && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Your Aggregate Results</h2>
              
              {/* Score Display */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48 flex items-center justify-center rounded-full bg-gray-700/30 border-8 border-indigo-600/30">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-indigo-400">{aggregate.toFixed(2)}%</span>
                    <span className="text-sm text-gray-300">Aggregate Score</span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4 bg-gray-700/20 p-4 rounded-lg">
                <h3 className="font-medium text-gray-200">Score Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{formData.educationType === 'FSc' ? 'Matric' : 'O-Level'} (10%):</span>
                    <span className="text-indigo-300 font-medium">
                      {((formData.matricMarks.obtained / formData.matricMarks.total) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{formData.educationType} (40%):</span>
                    <span className="text-indigo-300 font-medium">
                      {((formData.fscMarks.obtained / formData.fscMarks.total) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Entry Test (50%):</span>
                    <span className="text-indigo-300 font-medium">
                      {((formData.entryTestMarks.obtained / formData.entryTestMarks.total) * 100).toFixed(2)}%
                    </span>
                  </div>
                  {formData.educationType === 'A-Level' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">A-Level Bonus (10%):</span>
                      <span className="text-green-400 font-medium">Applied</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm p-4 bg-indigo-900/20 rounded-lg border border-indigo-800/30">
                <Info className="h-5 w-5 flex-shrink-0 text-indigo-400" />
                <p className="text-gray-300">
                  Based on the FAST University admission formula: Matric/O-Level (10%) + {formData.educationType} (40%) + {formData.entryTestType} Entry Test (50%)
                  {formData.educationType === 'A-Level' && ' with 10% additional weightage for A-Level students.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex mt-6">
                <button
                  onClick={() => setActiveSection('form')}
                  className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  Edit Information
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex justify-center">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {/* <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M13.5 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M9 14a5 5 0 0 0 6 0" />
              </svg> */}
              <FaWhatsapp className="h-5 w-5" />
              Join Entry Test Group
            </a>
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/80 py-6 mt-12 border-t border-gray-700/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <p className="text-gray-300">© Azan</p>
            <a
              href="https://linkedin.com/in/azanw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-all duration-300 transform hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/azannw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://instagram.com/azan.py"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
