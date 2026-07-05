import { useCallback, useEffect, useReducer } from 'react';

const DEFAULT_STEP_STORAGE_KEY = 'stepper_current_step';

export interface StepperState {
  currentStep: number
  isDragging: boolean
  maxSteps: number
}

export type StepperAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_TO_FIRST' }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_MAX_STEPS'; payload: number }

const clampStep = (step: number, maxSteps: number) => {
  if (!Number.isFinite(step)) {
    return 0;
  }

  return Math.min(Math.max(step, 0), maxSteps);
};

export function stepperReducer(
  state: StepperState,
  action: StepperAction,
): StepperState {
  switch (action.type) {
    case 'NEXT_STEP':
      if (state.currentStep < state.maxSteps) {
        return { ...state, currentStep: state.currentStep + 1 };
      }
      return state;

    case 'PREV_STEP':
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;

    case 'GO_TO_STEP':
      if (action.payload >= 0 && action.payload <= state.maxSteps) {
        return { ...state, currentStep: action.payload };
      }
      return state;

    case 'RESET_TO_FIRST':
      return { ...state, currentStep: 0 };

    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };

    case 'SET_MAX_STEPS':
      return {
        ...state,
        maxSteps: action.payload,
        currentStep: clampStep(state.currentStep, action.payload),
      };

    default:
      return state;
  }
}

export interface UseStepperReducerOptions {
  maxSteps: number
  storageKey?: string | null
  initialStep?: number
  clearOnMount?: boolean
  clearOnUnmount?: boolean
}

export function useStepperReducer(options: UseStepperReducerOptions) {
  const {
    maxSteps,
    initialStep = 0,
    storageKey = DEFAULT_STEP_STORAGE_KEY,
    clearOnMount = false,
    clearOnUnmount = false,
  } = options;

  const getSavedStep = useCallback((): number => {
    const normalizedInitialStep = clampStep(initialStep, maxSteps);

    if (!storageKey || typeof window === 'undefined') {
      return normalizedInitialStep;
    }

    const savedStep = window.localStorage.getItem(storageKey);
    if (savedStep) {
      const parsed = parseInt(savedStep, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= maxSteps) {
        return parsed;
      }
    }
    return normalizedInitialStep;
  }, [initialStep, maxSteps, storageKey]);

  const [state, baseDispatch] = useReducer(stepperReducer, undefined, () => ({
    currentStep:
      clearOnMount && storageKey && typeof window !== 'undefined'
        ? (() => {
            window.localStorage.removeItem(storageKey);
            return clampStep(initialStep, maxSteps);
          })()
        : getSavedStep(),
    isDragging: false,
    maxSteps,
  }));

  const dispatch = useCallback(
    (action: StepperAction) => {
      if (
        action.type === 'RESET_TO_FIRST' &&
        storageKey &&
        typeof window !== 'undefined'
      ) {
        window.localStorage.removeItem(storageKey);
      }

      baseDispatch(action);
    },
    [storageKey],
  );

  useEffect(() => {
    baseDispatch({ type: 'SET_MAX_STEPS', payload: maxSteps });
  }, [maxSteps]);

  useEffect(() => {
    baseDispatch({ type: 'GO_TO_STEP', payload: getSavedStep() });
  }, [getSavedStep]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, state.currentStep.toString());
  }, [state.currentStep, storageKey]);

  useEffect(() => {
    if (!clearOnUnmount || !storageKey || typeof window === 'undefined') {
      return;
    }

    const clearSavedStep = () => {
      window.localStorage.removeItem(storageKey);
    };

    window.addEventListener('beforeunload', clearSavedStep);

    return () => {
      clearSavedStep();
      window.removeEventListener('beforeunload', clearSavedStep);
    };
  }, [clearOnUnmount, storageKey]);

  return { state, dispatch };
}
