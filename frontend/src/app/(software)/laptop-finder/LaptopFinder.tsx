"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface FilterStep {
  id: number;
  title: string;
  type: "radio" | "checkbox";
  options: FilterOption[];
}

interface FilterOption {
  id: string;
  label: string;
  description?: string;
  value: string;
}

const filterSteps: FilterStep[] = [
  {
    id: 1,
    title: "What's your budget?",
    type: "radio",
    options: [
      { id: "budget-1", label: "Up to 40,000৳", value: "40000" },
      { id: "budget-2", label: "Up to 50,000৳", value: "50000" },
      { id: "budget-3", label: "Up to 60,000৳", value: "60000" },
      { id: "budget-4", label: "Up to 80,000৳", value: "80000" },
      { id: "budget-5", label: "Up to 100,000৳", value: "100000" },
      { id: "budget-6", label: "Up to 150,000৳", value: "150000" },
      { id: "budget-7", label: "Above 150,000৳", value: "150000+" },
    ]
  },
  {
    id: 2,
    title: "What is the primary purpose of your laptop?",
    type: "radio",
    options: [
      { id: "purpose-1", label: "Basic Home Use", description: "For everyday tasks and entertainment", value: "home" },
      { id: "purpose-2", label: "Basic Office Use", description: "For work and productivity", value: "office" },
      { id: "purpose-3", label: "Study", description: "For educational purposes", value: "study" },
      { id: "purpose-4", label: "Freelancing", description: "For professional freelance work", value: "freelancing" },
      { id: "purpose-5", label: "Basic Programming", description: "For coding and development", value: "programming" },
    ]
  },
  {
    id: 3,
    title: "What screen size do you prefer?",
    type: "radio",
    options: [
      { id: "screen-1", label: "Less than 13 inches", description: "Ultra-portable laptops", value: "small" },
      { id: "screen-2", label: "13 to 14.9 inches", description: "Balance of portability and screen space", value: "medium" },
      { id: "screen-3", label: "15 to 17 inches", description: "Standard laptop size", value: "large" },
      { id: "screen-4", label: "Bigger than 17 inches", description: "Desktop replacement", value: "extra-large" },
    ]
  },
  {
    id: 4,
    title: "Is portability important to you?",
    type: "radio",
    options: [
      { id: "portability-1", label: "Yes", description: "I need it to be lightweight and compact", value: "yes" },
      { id: "portability-2", label: "Not necessary", description: "I'll use it mainly at home or in the office", value: "no" },
    ]
  },
  {
    id: 5,
    title: "What other features are you looking for in your laptop?",
    type: "checkbox",
    options: [
      { id: "feature-1", label: "Backlit Keyboard", description: "For gaming atmosphere and aesthetics", value: "backlit-keyboard" },
      { id: "feature-2", label: "Fingerprint Sensor", description: "For quick and secure access", value: "fingerprint" },
      { id: "feature-3", label: "Touchscreen", description: "For intuitive screen interaction", value: "touchscreen" },
      { id: "feature-4", label: "360° Convertible", description: "Laptop turns into a tablet", value: "convertible" },
      { id: "feature-5", label: "Detachable", description: "Removable screen for ultimate portability", value: "detachable" },
    ]
  }
];

export default function LaptopFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [matchedCount, setMatchedCount] = useState(215);

  const currentFilter = filterSteps[currentStep];

  const handleRadioChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      [`step-${currentFilter.id}`]: value
    }));
    // Simulate updating matched count
    setMatchedCount(Math.max(11, matchedCount - Math.floor(Math.random() * 50)));
  };

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setFilters(prev => {
      const currentValues = prev[`step-${currentFilter.id}`] as string[] || [];
      if (checked) {
        return {
          ...prev,
          [`step-${currentFilter.id}`]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [`step-${currentFilter.id}`]: currentValues.filter(v => v !== value)
        };
      }
    });
    // Simulate updating matched count
    setMatchedCount(Math.max(11, matchedCount - Math.floor(Math.random() * 20)));
  };

  const handleNext = () => {
    if (currentStep < filterSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleShowResults = () => {
    console.log("Filters applied:", filters);
    // Navigate to results page
  };

  const getCurrentValue = () => {
    const value = filters[`step-${currentFilter.id}`];
    if (currentFilter.type === "checkbox") {
      return value as string[] || [];
    }
    return value as string || "";
  };

  const getCurrentRadioValue = (): string => {
    const value = filters[`step-${currentFilter.id}`];
    return value as string || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Laptop Finder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search laptops..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {filterSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {filterSteps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {currentFilter.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentFilter.type === "radio" ? (
              <RadioGroup
                value={getCurrentRadioValue()}
                onValueChange={handleRadioChange}
                className="space-y-4"
              >
                {currentFilter.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={option.value} id={option.id} />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      {option.description && (
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                {currentFilter.options.map((option) => (
                  <Card key={option.id} className={`cursor-pointer transition-colors ${
                    getCurrentValue().includes(option.value) ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={option.id}
                          checked={getCurrentValue().includes(option.value)}
                          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, option.value)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          {option.description && (
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation and Results */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </Button>

          <Button
            onClick={handleShowResults}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Show Matched Laptops ({matchedCount})
          </Button>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentStep === filterSteps.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
