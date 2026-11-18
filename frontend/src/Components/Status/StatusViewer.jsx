import { useEffect, useState, useCallback } from "react";
import { stories } from "./DummyStorage";
import ProgressBar from "./ProgressBar";
import {
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const STORY_DURATION = 5000;

const StatusViewer = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNextStory = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((previous) => previous + 1);
    } else {
      handleNavigate();
    }
  }, [currentStoryIndex, handleNavigate]);

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((previous) => previous - 1);
    }
  };

  useEffect(() => {
    if (isPaused || !stories.length) return;

    const timer = setTimeout(() => {
      handleNextStory();
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [currentStoryIndex, isPaused, handleNextStory]);

  if (!stories.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b141a] text-white">
        No stories available.
      </div>
    );
  }

  const currentStory = stories[currentStoryIndex];

  return (
    <div
      className="relative flex h-screen h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0b141a]"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Story Image */}
      <div className="relative flex h-full w-full items-center justify-center sm:h-[94vh] sm:max-w-[480px]">
        <img
          key={currentStoryIndex}
          src={currentStory.image}
          alt={`Story ${currentStoryIndex + 1}`}
          className="h-full w-full object-contain sm:rounded-xl"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        {/* Progress Bars */}
        <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 px-3 pt-4">
          {stories.map((story, index) => (
            <ProgressBar
              key={index}
              duration={STORY_DURATION}
              index={index}
              activeIndex={currentStoryIndex}
            />
          ))}
        </div>

        {/* Top Header */}
        <div className="absolute left-0 right-0 top-7 z-20 flex items-center justify-between px-4 pt-3">
          <div className="flex items-center gap-3">
            <BsArrowLeft
              onClick={handleNavigate}
              className="cursor-pointer text-2xl text-white"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Chattingo Status
              </p>

              <p className="text-xs text-gray-300">
                {currentStoryIndex + 1} of {stories.length}
              </p>
            </div>
          </div>

          <AiOutlineClose
            onClick={handleNavigate}
            className="cursor-pointer text-2xl text-white"
          />
        </div>

        {/* Previous / Next Controls */}
        <button
          type="button"
          onClick={handlePreviousStory}
          disabled={currentStoryIndex === 0}
          aria-label="Previous story"
          className="absolute bottom-0 left-0 top-20 z-10 w-1/3 cursor-pointer disabled:cursor-default"
        />

        <button
          type="button"
          onClick={handleNextStory}
          aria-label="Next story"
          className="absolute bottom-0 right-0 top-20 z-10 w-2/3 cursor-pointer"
        />

        {/* Navigation Arrows */}
        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 flex justify-between px-5">
          <BsArrowLeft className="text-xl text-white/70" />
          <BsArrowRight className="text-xl text-white/70" />
        </div>
      </div>
    </div>
  );
};

export default StatusViewer;
