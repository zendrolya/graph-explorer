import styles from './ConfirmDialog.module.css';

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.dialog} onClick={e => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={styles.confirmBtn}>Да</button>
                    <button onClick={onCancel} className={styles.cancelBtn}>Нет</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;