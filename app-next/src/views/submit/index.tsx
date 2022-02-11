// Next, React
import { FC, useState } from "react";
import { plantSourceData, PlantSource } from "models/plantSourceData";

const EntryItem: FC<{ source: PlantSource }> = ({ source }) => {
  const [val, setVal] = useState("0");
  console.log("source", source);
  return (
    <div className="grid grid-cols-2 p-1 m-1 w-56">
      <div>
        <span className="px-2">{source.emojiIcon}</span>
        {source.name}
      </div>
      <div className="flex px-2">
        <input
          value={val}
          min="0"
          max="10"
          className="w-24 border-2 border-gray-100 rounded "
          onChange={(i) => console.log(setVal(i.target.value))}
          onFocus={(evt) => {
            evt.target.select();
          }}
        />
        <div className="px-2 underline">max</div>
      </div>
    </div>
  );
};

const SubmitModal: FC<{ modalId: string }> = ({ modalId }) => {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col items-center">
            {plantSourceData.map((p) => (
              <EntryItem source={p} />
            ))}
          </div>
          <div className="modal-action">
            <label htmlFor={modalId} className="btn btn-primary">
              Submit
            </label>
            <label htmlFor={modalId} className="btn">
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export const SubmitView: FC = ({}) => {
  const modalId = "submit-modal";
  return (
    <>
      <div className="hero mx-auto min-h-16">
        <div className="hero-content flex flex-col max-w-lg justify-center">
          <h2 className="text-xl">Show me what you got</h2>
          <div className="container mx-auto ">
            <div className="flex justify-center py-2">
              <img src="/images/show_me.png" className="h-40" />
            </div>
            <div className="flex justify-center">
              <div>
                <label
                  htmlFor={modalId}
                  className="btn btn-primary modal-button"
                >
                  Submit for judging
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubmitModal modalId={modalId} />
    </>
  );
};
