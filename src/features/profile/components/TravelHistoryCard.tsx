import React, { useEffect, useState } from 'react'
import AddTravelHistoryModal from '../modals/AddTravelHistoryModal';
import { Plus } from 'lucide-react';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { PROFILE_PATHS } from '../../../constants/constants';
import { designRecipes } from "@srirag/leaf-design-system"

interface TravelHistory {
  id: number;
  userID: string;
  destination: string;
  yearVisited: number | string;
  Places: { placeName: string }[];
}

function TravelHistoryCard({ userID, self }: {userID: string|undefined, self: boolean}) {
    const axiosInstance = useAxiosInstance();
    const [showTravelModal, setShowTravelModal] = useState(false);
    const [travelHistory, setTravelHistory] = useState<TravelHistory[]>([]);


    /* fetch user details */
    useEffect(() => {
        axiosInstance.get(PROFILE_PATHS.travelHistoryByUser(userID)).then(resp => setTravelHistory(resp?.data?.data?.travelList)).catch(err => console.log(err));
    }, [])

    /* submit to the server */
    const AddTravelHistory = (data:{ destination: string, year: number, places: string[]}) => {
        axiosInstance.post(PROFILE_PATHS.travelHistory, {...data, year: String(data?.year)})
        .then(resp => setTravelHistory([ ...travelHistory, resp?.data?.data]))
        .catch(err => console.log(err?.response?.data))
    }

    return (
        <>
            <div className="space-y-4 pb-20">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Travel History</h2>
                    {self && (
                    <button
                        onClick={() => setShowTravelModal(true)}
                        className={`${designRecipes.buttonPrimary} flex items-center gap-2 px-4`}
                    >
                        <Plus className="h-4 w-4" />
                        Add Trip
                    </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {travelHistory?.length && travelHistory?.map((trip) => (
                        <div key={trip.id} className={`${designRecipes.panel} p-4`}>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">{trip.destination}</h3>
                                <span className="text-sm text-ds-text-muted">{trip.yearVisited}</span>
                            </div>
                            <div className="mt-2">
                                <h4 className="text-sm font-medium text-ds-text-secondary">Places visited:</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {trip?.Places?.map((place, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-ds-surface-muted rounded-full text-sm text-ds-text-secondary"
                                >
                                    {place?.placeName}
                                </span>
                                ))}
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AddTravelHistoryModal
                isOpen={showTravelModal}
                onClose={() => setShowTravelModal(false)}
                onSave={(data) => {
                    AddTravelHistory(data)
                    console.log('New travel history:', data);
                    setShowTravelModal(false);
                }}
            />
        </>
    )
}

export default TravelHistoryCard