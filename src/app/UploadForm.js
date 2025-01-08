'use client'
import { useActionState, useEffect } from "react";
import { uploadFile } from "@/app/actions";
import { toast } from 'sonner';



function UploadForm() {

  const [state, action, pending] = useActionState(uploadFile, {})

  useEffect(() => {
    if (state.success) toast.success(state.success)
    if (state.error) toast.error(state.error)
  }, [state])

  return (
    <form action={action}>
      <input type="file" name="file" required accept="image/*" />

      <button type="submit" disabled={pending}>
        {pending ? 'Subiendo archivo...' : "Subir archivo"}
      </button>
    </form>
  );
};

export default UploadForm;
