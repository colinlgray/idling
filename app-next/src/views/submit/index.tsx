// Next, React
import { FC } from "react";

export const SubmitView: FC = ({}) => {
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
                  htmlFor="my-modal-2"
                  className="btn btn-primary modal-button"
                >
                  Submit for judging
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <p>Judging period has not started yet</p>
          <div className="modal-action">
            <label htmlFor="my-modal-2" className="btn btn-primary">
              Accept
            </label>
            <label htmlFor="my-modal-2" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
