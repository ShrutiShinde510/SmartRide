import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../utils/api';

export default function TrackingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkActiveRide() {
      const { ok, data } = await apiGet('/api/bookings/my-bookings');
      if (ok && data.success) {
        const activeBooking = data.bookings.find(b => b.paymentStatus === 'Completed' || b.paymentStatus === 'Pending');
        if (activeBooking) {
          navigate(`/dashboard/booking/${activeBooking._id}/track`, { replace: true });
          return;
        }
      }
      setLoading(false);
    }
    checkActiveRide();
  }, [navigate]);

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: 'rgba(211,228,254,0.5)' }}>Finding your active ride...</div>;

  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'rgba(211,228,254,0.5)' }}>
      You have no active rides right now.
    </div>
  );
}
