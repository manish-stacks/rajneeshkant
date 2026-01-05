import React, { useState } from 'react';
import { useService } from '@/hooks/use-service';

const ServiceStep = () => {
    const { services } = useService();
    const [selectedService, setSelectedService] = useState(null);

    const handleSelect = (serviceId) => {
        setSelectedService(serviceId);
    };

    // Function to remove HTML tags from a string
    const removeHtmlTags = (htmlString) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.textContent || div.innerText || '';
    };

    return (
        <div className="max-w-screen-lg mx-auto px-2 py-6">
            <h2 className="text-2xl font-semibold mb-4">Clinical Symptoms / Services</h2>
            {/* <p>Select symptoms / treatment (existing service logic plug here)</p> */}
            <div className="flex justify-center flex-wrap gap-6">
                {services
                    .filter((service) => service.appointment_status === 'Show')
                    .map((service) => (
                        <div
                            key={service._id}
                            className={`p-4 bg-amber-50 border rounded-lg cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${selectedService === service._id ? 'border-rose-500' : 'border-transparent'
                                }`}
                            onClick={() => handleSelect(service._id)}
                        >
                            <h2 className="text-xl font-bold text-blue-900 mb-2">{service.service_name}</h2>
                            <p className="text-gray-700 text-sm">{removeHtmlTags(service.service_desc)}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ServiceStep;
