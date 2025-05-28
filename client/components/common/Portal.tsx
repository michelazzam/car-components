import { ReactNode } from "react";
import ReactDOM from "react-dom";

type PortalProps = {
  children: ReactNode;
};

export default function Portal({ children }: PortalProps) {
  return ReactDOM.createPortal(children, document.body);
}
