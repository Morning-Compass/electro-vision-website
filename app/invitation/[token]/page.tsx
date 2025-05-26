"use client";

import ApiLinks from "@/ev-const/api-links";
import PageTemplate from "@/components/templates/PageTemplate";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OLF from "@/ev-lib/ElectroVisionFetch";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifiAccountPage = () => {
  const params = useParams();
  const [invToken, setInvToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const token = Array.isArray(params.token) ? params.token[0] : params.token;
    setInvToken(token || null);
  }, [params.token]);

  const validateAccount = async () => {
    if (!invToken) return;
    return await OLF.put(ApiLinks.invitationWorkerAccept(invToken));
  };

  useEffect(() => {
    const validate = async () => {
      setLoading(true);
      try {
        const response = await validateAccount();
        console.log(response);
        setValidated(true);
        toast.success("Account validated!", { duration: 3000 });
      } catch (error) {
        console.error("Registration error:", error);
        setErr(
          error instanceof Error ? error.message : "Account validation failed",
        );
        toast.error(
          error instanceof Error ? error.message : "Account validation failed",
          { duration: 5000 },
        );
      } finally {
        setLoading(false);
      }
    };

    if (invToken) validate();
  }, [invToken]);

  return (
    <PageTemplate allowUnauthenticated={true}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-ev-text">
          Processing Invitation...
        </h1>

        <p className="text-ev-subtext">
          Token: <span className="break-all font-mono">{invToken}</span>
        </p>

        {loading && (
          <div className="flex flex-col items-center gap-2 mt-4 animate-pulse text-ev-accent-text">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p>Validating invitation, please wait...</p>
          </div>
        )}

        {!loading && validated && (
          <div className="flex flex-col items-center gap-2 mt-4 text-green-600">
            <CheckCircle2 className="w-10 h-10" />
            <p className="text-xl font-semibold">✅ Invitation was accepted!</p>
          </div>
        )}

        {!loading && err && (
          <div className="flex flex-col items-center gap-2 mt-4 text-red-600">
            <XCircle className="w-10 h-10" />
            <p className="text-xl font-semibold">❌ {err}</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default VerifiAccountPage;
