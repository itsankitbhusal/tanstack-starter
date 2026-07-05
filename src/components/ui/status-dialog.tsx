import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Button } from './button';

interface StatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'success' | 'error';
  title?: string;
  description?: string;
  buttonText?: string;
  onAction?: () => void;
}

export const StatusDialog = ({
  isOpen,
  onOpenChange,
  variant = 'success',
  title,
  description,
  buttonText = 'Done',
  onAction,
}: StatusDialogProps) => {
  const isSuccess = variant === 'success';

  const handleAction = () => {
    onOpenChange(false);
    if (onAction) onAction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-8 flex flex-col items-center text-center gap-6 rounded-3xl border-none shadow-xl">
        <div className="flex justify-center items-center">
          {isSuccess ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="81"
              height="74"
              viewBox="0 20 61 80"
              fill="none"
            >
              <path
                d="M51.3743 75.1243C51.7976 75.7806 51.9999 76.5155 51.9999 77.243C51.9999 78.5592 51.3369 79.8492 50.1268 80.5879C48.9542 81.3041 48.2574 82.5753 48.2574 83.9253C48.2574 84.0865 48.2686 84.2478 48.2875 84.4128C48.31 84.5778 48.3175 84.7428 48.3175 84.904C48.3175 86.884 46.819 88.5902 44.7959 88.7927C44.0317 88.8677 43.3237 89.1677 42.7467 89.6289C42.1698 90.0902 41.724 90.7126 41.4806 91.4439C40.9299 93.0826 39.4051 94.11 37.7754 94.11C37.3297 94.11 36.8764 94.0351 36.4343 93.8738C36.217 93.7951 35.9959 93.735 35.7712 93.6976C35.5465 93.6563 35.3217 93.6376 35.0969 93.6376C34.0629 93.6376 33.0477 94.0501 32.2985 94.8188C31.5343 95.6063 30.5153 96 29.5 96C28.4848 96 27.4658 95.6063 26.7016 94.8188C25.9523 94.0501 24.9371 93.6376 23.9031 93.6376C23.4535 93.6376 23.0003 93.7163 22.5657 93.8738C22.1235 94.0351 21.6703 94.11 21.2245 94.11C19.5948 94.11 18.0701 93.0826 17.5194 91.4439C17.2759 90.7126 16.8302 90.0902 16.2532 89.6289C15.6763 89.1677 14.9682 88.8677 14.204 88.7927C12.181 88.5902 10.6825 86.884 10.6825 84.904C10.6825 84.7428 10.69 84.5778 10.7125 84.4128C10.7312 84.2478 10.7425 84.0865 10.7425 83.9253C10.7425 82.5754 10.0457 81.3041 8.87317 80.5879C7.66312 79.8492 7 78.5592 7 77.243C7 76.5155 7.20237 75.7805 7.62562 75.1243C8.04522 74.4756 8.25125 73.7406 8.25125 72.9981C8.25125 72.2632 8.04522 71.5207 7.62562 70.8758C7.20237 70.2195 7 69.4845 7 68.7571C7 67.4409 7.66312 66.1547 8.87317 65.4159C10.0457 64.6996 10.7425 63.4247 10.7425 62.0747C10.7425 61.9135 10.7313 61.7523 10.7125 61.5873C10.69 61.4222 10.6825 61.2573 10.6825 61.0961C10.6825 59.1161 12.181 57.4099 14.204 57.2074C14.9682 57.1286 15.6763 56.8324 16.2532 56.3711C16.8302 55.9136 17.2759 55.2912 17.5194 54.5599C18.0701 52.9212 19.5986 51.89 21.2282 51.89C21.674 51.89 22.1235 51.965 22.5657 52.1262C23.0002 52.2874 23.4535 52.3625 23.9031 52.3625C24.9371 52.3625 25.9523 51.95 26.7016 51.1812C27.4657 50.3937 28.4848 50 29.5 50C30.5153 50 31.5343 50.3937 32.2985 51.1812C33.3736 52.283..."
                fill="#14931C"
                fillOpacity="0.8"
              />
              <g filter="url(#filter0_d_652_18331)">
                <path
                  d="M42.291 63.7235C41.3057 62.7588 39.7083 62.7588 38.723 63.7235L26.1308 76.0541L21.3071 71.3308C20.3218 70.3661 18.7241 70.3661 17.739 71.3308C16.7537 72.2957 16.7537 73.8598 17.739 74.8247L24.3467 81.295C24.8394 81.7773 25.485 82.0186 26.1308 82.0186C26.7765 82.0186 27.4222 81.7773 27.9148 81.295L42.291 67.2175C43.2763 66.2526 43.2763 64.6885 42.291 63.7235Z"
                  fill="white"
                />
              </g>
            </svg>
          ) : (
            <div className="p-2 rounded-full bg-destructive/80">
              <X className="w-8 h-8 text-destructive-foreground stroke-[3px]" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 transition-all duration-300">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {title ||
              (isSuccess ? 'Created Successfully' : 'Submission Failed')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-medium leading-relaxed max-w-[300px]">
            {description ||
              (isSuccess
                ? 'The user/identity has been added and created successfully.'
                : 'Something went wrong while processing your request. Please try again.')}
          </DialogDescription>
        </div>

        <Button
          variant="outline"
          onClick={handleAction}
          className="w-full max-w-[320px] h-10 rounded-xl text-foreground font-semibold border border-border text-xs"
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
