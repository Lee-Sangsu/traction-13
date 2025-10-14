'use client'
import { useEffect } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { ScholarshipButton } from '@/components/scholarship-button'

// This component will be imported by the toast to trigger the dialog
let openScholarshipDialog: (() => void) | null = null;

export const setScholarshipDialogOpener = (opener: () => void) => {
  openScholarshipDialog = opener;
};

export const StudentToast = () => {
  useEffect(() => {
    // Show toast after a short delay to let the page load
    const timer = setTimeout(() => {
      toast.custom((t) => (
        <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Are you a student?
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Request for free access to the challenge.
              </p>

              <ScholarshipButton 
                text="GET SCHOLARSHIP"
                variant="default"
                className="w-full bg-blue-600"
                children={(<div className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                  <MessageCircle className="w-3 h-3" />
                  Request free access
                </div>)}
              />
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ), {
        id: 'student-toast',
        duration: Infinity, // Never auto-dismiss
        position: "bottom-right",
      });
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};
