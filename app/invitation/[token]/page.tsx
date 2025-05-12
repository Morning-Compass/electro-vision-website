"use client";

import ApiLinks from "@/ev-const/api-links";
import PageTemplate from "@/components/templates/PageTemplate";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OLF from "@/ev-lib/ElectroVisionFetch";
import { useParams } from "next/navigation";

const VerifiAccountPage = () => {
  // Get params using the new recommended approach
  const params = useParams();
  const [invToken, setInvToken] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // Access token from params
    const token = Array.isArray(params.token) ? params.token[0] : params.token;
    setInvToken(token || null);
  }, [params.token]);

  const validateAccount = async () => {
    if (!invToken) return;
    return await OLF.put(ApiLinks.invitationWorkerAccept(invToken));
  };

  useEffect(() => {
    const validate = async () => {
      try {
        const response = await validateAccount();
        console.log(response);
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
      }
    };

    if (invToken) validate();
  }, [invToken]);

  return (
    <PageTemplate allowUnauthenticated={true}>
      <article>Validate your Electro Vision account</article>
      <article>Token {invToken}</article>
      {validated ?? <p>Account Validated</p>}
      {err ?? <p>{err}</p>}
    </PageTemplate>
  );
};

export default VerifiAccountPage;
