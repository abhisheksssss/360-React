import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ThreeSixty from "react-360-view";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Calculator, 
  Car, 
  Calendar, 
  Gauge, 
  DollarSign, 
  Users, 
  Clock,
  X,
  BarChart3,
  Play,
  Pause,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const basePath = "https://fastly-production.24c.in/webin/360";

// Enhanced Image Carousel Component
const ImageCarousel = ({ images, basePath }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [zoom, setZoom] = useState(1);
  const intervalRef = useRef(null);

  const carImages = useMemo(() => 
    Array.from({ length: 75 }, (_, i) => `${basePath}/output_${i + 1}.jpeg`)
  , [basePath]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
      }, 150);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, carImages.length]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  }, [carImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  }, [carImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextImage, prevImage]);

  return (
    <div 
      className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
      role="region" 
      aria-label="Car 360° Image Viewer" 
      aria-roledescription="carousel" 
      tabIndex={0}
    >
      <div className="relative h-96 overflow-hidden bg-gray-800">
        <img 
          src={carImages[currentImageIndex]}
          alt={`Car view ${currentImageIndex + 1} of ${carImages.length}`}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
          onError={(e) => {
            e.target.src = '/api/placeholder/800/600';
          }}
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Control Panel */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsAutoPlay(prev => !prev)}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isAutoPlay ? "Pause rotation" : "Start rotation"}
          >
            {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Zoom in"
            disabled={zoom >= 3}
          >
            <ZoomIn size={16} />
          </button>
          
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Zoom out"
            disabled={zoom <= 0.5}
          >
            <ZoomOut size={16} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-3 py-1">
          <span className="text-white text-sm">
            {currentImageIndex + 1} / {carImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
        {carImages.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index * 7)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              Math.floor(currentImageIndex / 7) === index 
                ? 'border-blue-400 ring-2 ring-blue-400/50' 
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <img 
              src={carImages[index * 7]}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced EMI Calculator Modal
const EMICalculatorModal = ({ onClose }) => {
  const [loanAmount, setLoanAmount] = useState(1060800);
  const [downPayment, setDownPayment] = useState(265200);
  const [loanDuration, setLoanDuration] = useState(66);
  const [monthlyEMI, setMonthlyEMI] = useState(22581);
  const [interestRate, setInterestRate] = useState(8.5);
  const modalRef = useRef(null);

  const calculateEMI = useCallback((principal, rate, tenure) => {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  }, []);

  const calculateTotalInterest = useCallback(() => {
    const principal = loanAmount - downPayment;
    const totalPayment = monthlyEMI * loanDuration;
    return totalPayment - principal;
  }, [loanAmount, downPayment, monthlyEMI, loanDuration]);

  useEffect(() => {
    const principal = loanAmount - downPayment;
    const emi = calculateEMI(principal, interestRate, loanDuration);
    setMonthlyEMI(emi);
  }, [loanAmount, downPayment, loanDuration, interestRate, calculateEMI]);

  // Focus management for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (modalRef.current) {
      modalRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emi-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto focus:outline-none"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="emi-modal-title" className="text-xl font-bold text-gray-900">
            EMI Calculator & Eligibility
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Loan Amount</label>
              <span className="text-purple-600 font-bold">₹ {loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="1326000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${((loanAmount - 100000) / (1326000 - 100000)) * 100}%, #e5e7eb ${((loanAmount - 100000) / (1326000 - 100000)) * 100}%, #e5e7eb 100%)`
              }}
              aria-label="Loan amount slider"
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>₹ 1L</span>
              <span>₹ 13.26L</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Down Payment</label>
              <span className="text-purple-600 font-bold">₹ {downPayment.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1226000"
              step="5000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(downPayment / 1226000) * 100}%, #e5e7eb ${(downPayment / 1226000) * 100}%, #e5e7eb 100%)`
              }}
              aria-label="Down payment slider"
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>₹ 0</span>
              <span>₹ 12.26L</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Interest Rate</label>
              <span className="text-purple-600 font-bold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="6"
              max="15"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${((interestRate - 6) / (15 - 6)) * 100}%, #e5e7eb ${((interestRate - 6) / (15 - 6)) * 100}%, #e5e7eb 100%)`
              }}
              aria-label="Interest rate slider"
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>6%</span>
              <span>15%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Loan Duration</label>
              <span className="text-purple-600 font-bold">{loanDuration} Months</span>
            </div>
            <input
              type="range"
              min="12"
              max="84"
              value={loanDuration}
              onChange={(e) => setLoanDuration(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${((loanDuration - 12) / (84 - 12)) * 100}%, #e5e7eb ${((loanDuration - 12) / (84 - 12)) * 100}%, #e5e7eb 100%)`
              }}
              aria-label="Loan duration slider"
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>1 Year</span>
              <span>7 Years</span>
            </div>
          </div>

          {/* Enhanced results display */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                ₹{monthlyEMI.toLocaleString('en-IN')}
              </div>
              <div className="text-gray-600 text-sm">Monthly EMI</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-800">
                  ₹{(loanAmount - downPayment).toLocaleString('en-IN')}
                </div>
                <div className="text-gray-600">Principal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">
                  ₹{calculateTotalInterest().toLocaleString('en-IN')}
                </div>
                <div className="text-gray-600">Total Interest</div>
              </div>
            </div>
          </div>

          {/* <div className="space-y-3">
            <button className="w-full text-purple-600 font-medium py-2 flex items-center justify-center gap-2 hover:bg-purple-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
              <BarChart3 size={16} />
              View Detailed Breakup
            </button>

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              <span className="bg-yellow-400 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">₹</span>
              Check Eligibility & Apply
            </button>
          </div> */}

          {/* <div className="text-xs text-gray-500 space-y-1">
            <p>*Interest rates vary based on credit profile and bank policies.</p>
            <p>**Processing fees and additional charges not included in calculation.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Main component simplified to core requirements
export default function App() {
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [invites, setInvites] = useState(100);
  const [duration, setDuration] = useState(7);
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [is360View, setIs360View] = useState(true);

  const carData = useMemo(() => ({
    model: "BMW X5 M Sport",
    year: 2023,
    mileage: "12.5 kmpl", 
    price: "₹75,50,000",
    variant: "xDrive40i M Sport",
    condition: "Assured+ with 3-year warranty",
    tyreFront: "L-95% R-95%",
    tyreRear: "L-95% R-95%",
    tyreSpare: "100%",
    features: ["Panoramic Sunroof", "Heated Seats", "Navigation", "Premium Audio"]
  }), []);

  // Enhanced event price calculator
  useEffect(() => {
    const basePrice = 5000;
    const inviteMultiplier = invites > 300 ? 15 : invites > 150 ? 12.5 : 10;
    const durationMultiplier = duration > 15 ? 1.2 : duration > 7 ? 1.1 : 1;
    
    const calculated = Math.round(
      basePrice + (invites * duration * inviteMultiplier * durationMultiplier)
    );
    setCalculatedValue(calculated);
  }, [invites, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              <span className="text-blue-400">Alpha</span>Cars
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Cars</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Finance</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - 360 View & Controls */}
          <div className="space-y-6">
            {is360View ? (
              <ImageCarousel images={75} basePath={basePath} />
            ) : (
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-96 overflow-hidden bg-gray-800">
                  <ThreeSixty
                    amount={75}
                    imagePath={basePath}
                    fileName="output_{index}.jpeg"
                    spinReverse
                    loop
                    autoplay={false}
                    buttonClass="light"
                  />
                </div>
              </div>
            )}

            {/* Simplified Control Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIs360View(prev => !prev)}
                className="py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                <RotateCcw size={20} />
                {is360View ? 'Auto View' : '360° View'}
              </button>
              
              <button
                onClick={() => setShowEMICalculator(true)}
                className="py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                <Calculator size={20} />
                EMI Calculator
              </button>
            </div>
          </div>

          {/* Right Column - Car Details & Calculators */}
          <div className="space-y-6">
            {/* Car Overview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Car className="text-blue-400" />
                {carData.model}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car size={18} className="text-blue-400" />
                    <span className="text-white/60 text-sm">Model</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{carData.model}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={18} className="text-green-400" />
                    <span className="text-white/60 text-sm">Year</span>
                  </div>
                  <p className="text-white font-semibold">{carData.year}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge size={18} className="text-orange-400" />
                    <span className="text-white/60 text-sm">Mileage</span>
                  </div>
                  <p className="text-white font-semibold">{carData.mileage}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-yellow-400" />
                    <span className="text-white/60 text-sm">Price</span>
                  </div>
                  <p className="text-white font-semibold">{carData.price}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-green-400 text-sm font-medium mb-2">{carData.condition}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                    <p>Variant: {carData.variant}</p>
                    <p>Tyre Front: {carData.tyreFront}</p>
                    <p>Tyre Rear: {carData.tyreRear}</p>
                    <p>Spare: {carData.tyreSpare}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Key Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {carData.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Price Calculator */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="text-purple-400" />
                Event Pricing Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Users size={16} className="text-blue-400" />
                    Number of Invites
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={invites}
                    onChange={(e) => setInvites(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((invites - 50) / (500 - 50)) * 100}%, rgba(255,255,255,0.2) ${((invites - 50) / (500 - 50)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-white/60 text-sm mt-1">
                    <span>50</span>
                    <span className="font-semibold text-white">{invites}</span>
                    <span>500</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Clock size={16} className="text-green-400" />
                    Duration of Event (days)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${((duration - 1) / (30 - 1)) * 100}%, rgba(255,255,255,0.2) ${((duration - 1) / (30 - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-white/60 text-sm mt-1">
                    <span>1 day</span>
                    <span className="font-semibold text-white">{duration} days</span>
                    <span>30 days</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 mt-6 border border-purple-400/30">
                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-1">Calculated Event Price</p>
                    <p className="text-3xl font-bold text-white">
                      ₹{calculatedValue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      Based on {invites} invites for {duration} days
                    </p>
                    <p className="text-white/40 text-xs mt-2">
                      {invites > 300 && "*Premium pricing for large events"}
                      {duration > 15 && "*Extended duration surcharge applied"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Get Quote Button */}
            {/* <div className="w-full">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                <DollarSign size={20} />
                Get Quote
              </button>
            </div> */}
          </div>
        </div>
      </main>

      {/* EMI Calculator Modal */}
      {showEMICalculator && (
        <EMICalculatorModal onClose={() => setShowEMICalculator(false)} />
      )}
    </div>
  );
}
