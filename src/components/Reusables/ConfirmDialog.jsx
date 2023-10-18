import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

const ConfirmDialog = createContext();

export function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState({ isOpen: false });
  const fn = useRef();

  const confirm = useCallback(
    (data) => {
      return new Promise((resolve) => {
        setState({ ...data, isOpen: true });
        fn.current = (choice) => {
          resolve(choice);
          setState({ isOpen: false });
        };
      });
    },
    [setState]
  );

  return (
    <ConfirmDialog.Provider value={confirm}>
      {children}
      <Alert
        {...state}
        onClose={() => fn.current(false)}
        onConfirm={() => fn.current(true)}
      />
    </ConfirmDialog.Provider>
  );
}

export default function useConfirm() {
  return useContext(ConfirmDialog);
}