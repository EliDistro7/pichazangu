import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/router";

const EventAccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const api = process.env.NEXT_PUBLIC_SERVER;

  useEffect(() => {
    const validateQRCode = async () => {
      const eventId = searchParams.get("eventId");
      const token = searchParams.get("token");

      if (!eventId || !token) {
        setError("Invalid QR Code");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.post(`${api}/validate-qr`, { eventId, token });

        if (data.eventId) {
          // Redirect to the event page with a "validated" query parameter
          router.push(`/evento/${data.eventId}?qrValidated=true`);
        }
      } catch (err) {
        setError("QR Code validation failed");
      } finally {
        setLoading(false);
      }
    };

    validateQRCode();
  }, [searchParams, router]);

  return (
    <div>
      {loading && <p>Validating QR Code...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default EventAccess;
