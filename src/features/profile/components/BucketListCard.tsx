import React, { useEffect, useState } from 'react'
import AddBucketListModal from '../modals/AddBucketListModal';
import { Plus } from 'lucide-react';
import useAxiosInstance from '../../../axios/axiosInstance';
import { designRecipes } from 'hostApp/designRecipes';

function BucketListCard({ userID, self }: {userID: string|undefined, self: boolean}) {
    const [bucketList, setBucketList] = useState<Array<{ destination: string, notes: string, id: number }>>([]);
    const [showBucketModal, setShowBucketModal] = useState(false);
    const axiosInstance = useAxiosInstance();

    const saveBucketList = (destination: string, notes: string) => {
        axiosInstance.post("/profile/bucket-list", { destination, notes })
        .then(resp => setBucketList([...bucketList, resp?.data?.data]))
        .catch(err => console.log(err?.response?.data))
    }

    /* fetch user details */
    useEffect(() => {
        axiosInstance.get("/profile/bucket-list/" + (userID ? userID : "self"))
        .then(resp => setBucketList(resp?.data?.data?.response))
        .catch(err => console.log(err));
    }, [])


    return (
        <>
            <div className="space-y-4 pb-20">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Bucket List</h2>
                    {self && (
                    <button
                        onClick={() => setShowBucketModal(true)}
                        className={`${designRecipes.buttonPrimary} flex items-center gap-2 px-4`}
                    >
                        <Plus className="h-4 w-4" />
                        Add Destination
                    </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bucketList.map((item) => (
                    <div key={item.id} className={`${designRecipes.panel} p-4`}>
                        <h3 className="text-lg font-semibold">{item.destination}</h3>
                        <p className="mt-2 text-ds-text-secondary">{item.notes}</p>
                    </div>
                    ))}
                </div>
            </div>
            {/* bucket list modal */}
            <AddBucketListModal
                isOpen={showBucketModal}
                onClose={() => setShowBucketModal(false)}
                onSave={(data) => {
                    console.log('New bucket list item:', data);
                    saveBucketList(data.destination, data.notes);
                }}
            />
        </>
    )
}

export default BucketListCard