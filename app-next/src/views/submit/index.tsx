// Next, React
import { FC } from "react";

const SubmitModal: FC<{ modalId: string }> = ({ modalId }) => {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="grid grid-cols-2">
            <div>item 1</div>
            <div>
              <input min="0" max="10" />
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor={modalId} className="btn btn-primary">
              Accept
            </label>
            <label htmlFor={modalId} className="btn">
              Close
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
