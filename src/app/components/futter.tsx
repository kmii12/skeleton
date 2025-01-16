import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faCalendar, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { faCalendar as faRegCalendar } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import styles from './futter.module.scss'; // 修正したSCSSファイルをインポート

const Futter = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isCalendarOn, setIsCalendarOn] = useState(true);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  return (
    <div className={styles.footer}>
      <button
        className={`${styles.footer__button} ${activeButton === 'list' ? styles.active : ''}`}
        onClick={() => handleButtonClick('list')}
      >
        <FontAwesomeIcon icon={faList} />
      </button>
      <div className={styles.footer__buttonsMiddle}>
        <button
          className={`${styles.footer__button} ${activeButton === 'calendar1' ? styles.active : ''}`}
          onClick={() => { setIsCalendarOn(true); handleButtonClick('calendar1'); }}
        >
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button
          className={`${styles.footer__button} ${activeButton === 'calendar2' ? styles.active : ''}`}
          onClick={() => { setIsCalendarOn(false); handleButtonClick('calendar2'); }}
        >
          <FontAwesomeIcon icon={faRegCalendar} />
        </button>
      </div>
      <button
        className={`${styles.footer__button} ${activeButton === 'listCheck' ? styles.active : ''}`}
        onClick={() => handleButtonClick('listCheck')}
      >
        <FontAwesomeIcon icon={faListCheck} />
      </button>
    </div>
  );
};

export default Futter;
