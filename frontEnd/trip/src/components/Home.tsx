import React from "react";
import lens from "../assets/morocco.jpg";

type Restaurant = { name: string; price: number; };
type Activity = { name: string; price: number; };
type Hotel = { name: string; total_cost: number; };
type Trip = { hotel: Hotel | null; hotel_total_cost: number | null; restaurants: Restaurant[]; activities: Activity[]; };
type HomeProps = { trip: Trip; isAuthenticated: boolean; };

const Home: React.FC<HomeProps> = ({ trip, isAuthenticated }) => {
  // If not authenticated, show welcome screen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen relative">
        <img src={lens} alt="Morocco" className="absolute inset-0 object-cover w-full h-full" />
        <div className="relative z-10 text-center text-white p-5 bg-black/30 rounded-xl backdrop-blur-sm">
          <h1 className="font-extrabold text-5xl mb-8">Welcome!</h1>
          <p className="text-lg">Please sign in to view your trip details.</p>
        </div>
      </div>
    );
  }

  // If authenticated but no search inputs yet
  if (!trip.hotel && trip.restaurants.length === 0 && trip.activities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-start space-y-12 pt-20">
            <div className="text-center space-y-4">
              <h1 className="font-extrabold text-6xl text-gray-800 tracking-tight">
                Where to go?
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Enter your travel details and let us plan your perfect trip
              </p>
            </div>
            
            <div className="w-full max-w-6xl mt-8">
              {/* Menubar will be rendered here from Main.tsx */}
            </div>

            {/* Additional features section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-16">
              <FeatureCard 
                title="Personalized Planning"
                description="Get customized recommendations based on your preferences and budget"
                icon="🎯"
              />
              <FeatureCard 
                title="Local Experiences"
                description="Discover authentic local activities and hidden gems"
                icon="🌟"
              />
              <FeatureCard 
                title="Smart Budgeting"
                description="Optimize your spending with our budget-friendly suggestions"
                icon="💰"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render trip details if available...
  return (
    <div className="max-w-3xl mx-auto p-5">
      {/* ... rest of the trip details code ... */}
    </div>
  );
};

// Helper component for feature cards
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;