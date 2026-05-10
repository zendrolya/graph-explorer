import { useEffect, useState } from "react";
import styles from "./MaxFlowAnimation.module.css";

function MaxFlowAnimation({ data, onClose, onStepChange }) {
  const { steps, currentStep, maxFlow, source, sink } = data;

  const [isPlaying, setIsPlaying] = useState(false);

  const current = steps[currentStep];

  /*
  ==========================================
  AUTOPLAY
  ==========================================
  */

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      onStepChange(currentStep + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, onStepChange]);

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const handlePrev = () => {
    if (currentStep <= 0) return;

    onStepChange(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep >= steps.length - 1) return;

    onStepChange(currentStep + 1);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  /*
  ==========================================
  RENDER
  ==========================================
  */

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.close_button} onClick={onClose}>
          <img src="/icons/close.svg" draggable="false" alt="Закрыть" />
        </button>

        <h2 className={styles.title}>Анимация максимального потока</h2>

        <div className={styles.info}>
          <p>
            <strong>Источник:</strong> {source}
          </p>

          <p>
            <strong>Сток:</strong> {sink}
          </p>

          <p>
            <strong>Шаг:</strong> {steps.length === 0 ? 0 : currentStep + 1} /{" "}
            {steps.length}
          </p>

          <p>
            <strong>Текущий поток:</strong> {current?.totalFlow ?? 0}
          </p>

          <p>
            <strong>Максимальный поток:</strong> {maxFlow}
          </p>
        </div>

        {steps.length === 0 ? (
          <div className={styles.empty}>Увеличивающих путей не найдено</div>
        ) : (
          <div className={styles.step_block}>
            <h3 className={styles.step_title}>Увеличивающий путь</h3>

            <div className={styles.path}>
              {current.path.map((edge, index) => (
                <span key={index}>
                  {edge.from}
                  {" → "}
                  {edge.to}

                  {index !== current.path.length - 1 && "  "}
                </span>
              ))}
            </div>

            <div className={styles.flow}>
              Добавленный поток: <strong>{current.pathFlow}</strong>
            </div>

            <div className={styles.edges_changes}>
              <h4>Изменение остаточных пропускных способностей:</h4>

              {current.changedEdges.map((edge, index) => (
                <div key={index} className={styles.edge_change}>
                  {edge.from}
                  {" → "}
                  {edge.to}
                  {": "}
                  {edge.before}
                  {" → "}
                  {edge.after}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.controls}>
          <button
            className={styles.control_button}
            onClick={handlePrev}
            disabled={currentStep <= 0}
          >
            ◀ Назад
          </button>

          <button
            className={styles.control_button}
            onClick={togglePlay}
            disabled={steps.length === 0}
          >
            {isPlaying ? "⏸ Стоп" : "▶ Авто"}
          </button>

          <button
            className={styles.control_button}
            onClick={handleNext}
            disabled={currentStep >= steps.length - 1}
          >
            ▶ Вперед
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaxFlowAnimation;
