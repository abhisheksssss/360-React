import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Mouse,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';

// Car data
const carData = {
  model: "BMW X5 M Sport",
  year: 2023,
  mileage: "12.5 kmpl", 
  price: "₹75,50,000",
  variant: "xDrive40i M Sport",
  condition: "Assured+ with 3-year warranty",
  tyreFront: "L-95% R-95%",
  tyreRear: "L-95% R-95%",
  tyreSpare: "100%"
};

interface EMICalculatorModalProps {
  onClose: () => void;
}

const EMICalculatorModal: React.FC<EMICalculatorModalProps> = ({ onClose }) => {
  const [loanAmount, setLoanAmount] = useState(1060800);
  const [downPayment, setDownPayment] = useState(265200);
  const [loanDuration, setLoanDuration] = useState(66);
  const [monthlyEMI, setMonthlyEMI] = useState(22581);

  const calculateEMI = useCallback((principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  }, []);

  useEffect(() => {
    const principal = loanAmount - downPayment;
    const rate = 8.5;
    const emi = calculateEMI(principal, rate, loanDuration);
    setMonthlyEMI(emi);
  }, [loanAmount, downPayment, loanDuration, calculateEMI]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Check Eligibility</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* EMI Calculator Content */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">EMI Calculator</h3>
          
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Loan Amount</label>
              <span className="text-purple-600 font-bold">₹ {loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="1326000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${((loanAmount - 100000) / (1326000 - 100000)) * 100}%, #e5e7eb ${((loanAmount - 100000) / (1326000 - 100000)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>₹ 1,00,000</span>
              <span>₹ 13,26,000</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Down Payment</label>
              <span className="text-purple-600 font-bold">₹ {downPayment.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1226000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(downPayment / 1226000) * 100}%, #e5e7eb ${(downPayment / 1226000) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>₹ 0</span>
              <span>₹ 12,26,000</span>
            </div>
          </div>

          {/* Duration of Loan */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Duration of Loan</label>
              <span className="text-purple-600 font-bold">{loanDuration} Months</span>
            </div>
            <input
              type="range"
              min="12"
              max="84"
              value={loanDuration}
              onChange={(e) => setLoanDuration(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${((loanDuration - 12) / (84 - 12)) * 100}%, #e5e7eb ${((loanDuration - 12) / (84 - 12)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>12 Months</span>
              <span>84 Months</span>
            </div>
          </div>

          {/* EMI Result */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              ₹{monthlyEMI.toLocaleString('en-IN')}
            </div>
            <div className="text-gray-600 text-sm">per month</div>
          </div>

          {/* View Loan Breakup */}
          <button className="w-full text-purple-600 font-medium py-2 flex items-center justify-center gap-2 hover:bg-purple-50 rounded-lg transition-colors">
            <BarChart3 size={16} />
            View Loan Breakup
          </button>

          {/* Check Eligibility Button */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            <span className="bg-yellow-400 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">₹</span>
            Check eligibility
          </button>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>*Rate of interest can vary subject to credit profile. Loan approval is at the sole discretion of the finance partner.</p>
            <p>**Processing fee and other loan charges are not included.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Components() {
  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [currentVideoSource, setCurrentVideoSource] = useState(0);

  // Event calculator states
  const [invites, setInvites] = useState(100);
  const [duration, setDuration] = useState(7);
  const [calculatedValue, setCalculatedValue] = useState(0);

  // Regular carousel images with working URLs
  const carImages = useMemo(() => [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop", 
    "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop",
  ], []);

  // Working 360° video sources
  const car360Videos = useMemo(() => [
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "/videos/car-360-sample.mp4"
  ], []);

  // Navigation functions
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  }, [carImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  }, [carImages.length]);

  // Video error handler
  const handleVideoError = useCallback(() => {
    if (currentVideoSource < car360Videos.length - 1) {
      setCurrentVideoSource(prev => prev + 1);
      setVideoError(false);
    } else {
      setVideoError(true);
      setIs360View(false);
    }
  }, [currentVideoSource, car360Videos.length]);

  // Video seek handling
  const handleVideoSeek = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    if (!is360View) return;
    const video = e.currentTarget;
    if (!video) return;

    const rect = video.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const seekPosition = (x / width) * video.duration;
    video.currentTime = seekPosition;
  }, [is360View]);

  const toggle360View = useCallback(() => {
    setIs360View(prev => {
      if (!prev) {
        setVideoError(false);
        setCurrentVideoSource(0);
        const video = document.querySelector('.car-360-video') as HTMLVideoElement;
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {
            handleVideoError();
          });
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(false);
      }
      return !prev;
    });
  }, [handleVideoError]);

  // Event price calculator
  useEffect(() => {
    const basePrice = 5000;
    const multiplier = 12.5;
    const calculated = basePrice + (invites * duration * multiplier);
    setCalculatedValue(calculated);
  }, [invites, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              <span className="text-blue-400">Alpha</span>Cars
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Cars</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image Carousel & 360° View */}
          <div className="space-y-6">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
              {/* 360° View or Regular Carousel */}
              {is360View ? (
                <div className="relative h-96 overflow-hidden bg-gray-800">
                  {!videoError ? (
                    <>
                      <video
                        className="w-full h-full object-cover car-360-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls={false}
                        src={car360Videos[currentVideoSource]}
                        onError={handleVideoError}
                        onMouseDown={(e) => {
                          setIsDragging(true);
                          handleVideoSeek(e);
                        }}
                        onMouseMove={(e) => isDragging && handleVideoSeek(e)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onTimeUpdate={(e) => {
                          const video = e.currentTarget;
                          if (video.currentTime >= video.duration - 0.1) {
                            video.currentTime = 0;
                          }
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-4 py-2 rounded-full text-sm font-medium z-10 flex items-center gap-2">
                        <Mouse size={16} />
                        360° Video View
                      </div>
                    </>
                  ) : (
                    <div className="absolute top-16 left-4 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Video playback failed
                    </div>
                  )}

                  <button
                    onClick={() => setIs360View(false)}
                    className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600/90 text-white p-2 rounded-full transition-all z-10"
                  >
                    <X size={16} />
                  </button>

                  {!videoError && (
                    <div className="absolute bottom-4 left-4 z-10">
                      <button 
                        onClick={() => {
                          const video = document.querySelector('.car-360-video') as HTMLVideoElement;
                          if (video) {
                            if (video.paused) {
                              video.play();
                              setIsPlaying(true);
                            } else {
                              video.pause();
                              setIsPlaying(false);
                            }
                          }
                        }}
                        className={`bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${isPlaying ? 'is-playing' : ''}`}
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative h-96 overflow-hidden bg-gray-800">
                  <img
                    src={carImages[currentImageIndex]}
                    alt={`${carData.model} - View ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
                    {currentImageIndex + 1} / {carImages.length}
                  </div>
                </div>
              )}

              {/* Thumbnail Strip - Only show in normal view */}
              {!is360View && (
                <div className="flex space-x-2 p-4 overflow-x-auto">
                  {carImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        index === currentImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-300'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={toggle360View}
                className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  is360View
                    ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'
                }`}
              >
                <RotateCcw size={20} />
                {is360View ? 'Exit 360°' : '360° View'}
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
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Car className="text-blue-400" />
                Car Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-green-400 text-sm font-medium mb-2">{carData.condition}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                  <p>Variant: {carData.variant}</p>
                  <p>Tyre Front: {carData.tyreFront}</p>
                  <p>Tyre Rear: {carData.tyreRear}</p>
                  <p>Spare: {carData.tyreSpare}</p>
                </div>
              </div>
            </div>

            {/* Event Price Calculator */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="text-purple-400" />
                Event Price Calculator
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
                    aria-label="Number of invites"
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
                    aria-label="Duration of event in days"
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
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
                Book Test Drive
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMI Calculator Modal */}
      {showEMICalculator && <EMICalculatorModal onClose={() => setShowEMICalculator(false)} />}
    </div>
  );
}