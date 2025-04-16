import { cn } from "@/utils/cn";
import CurrencyInput from "react-currency-input-field";
import Button from "./Button";

function IncDecButton({
  dec,
  inc,
  size,
  value = 0,
  onChange,
}: {
  dec: () => void;
  inc: () => void;
  size?: "sm" | "lg";
  value: number;
  onChange:(val:number) => void;
}) {
  return (
    <div>
      <td className="">
        <div
          className={cn(
            " rounded-[10px]  bg-primary/20 flex justify-between ",
            size === "sm" && "py-1 px-1",
            size === "lg" && "py-2 px-3"
          )}
        >
          <Button onClick={dec} type="dec" size={size} />

          <CurrencyInput
            readOnly={false}
            value={value}
            onValueChange={(v) => {
              onChange(v?Number(v):0);
            }}
            className="max-w-8 py-0 px-0 border-0 bg-transparent text-center text-base"
          />

          <Button onClick={inc} type="inc" size={size} />
        </div>
      </td>
    </div>
  );
}

export default IncDecButton;
