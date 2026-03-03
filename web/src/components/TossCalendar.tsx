import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import './TossCalendar.css';

const SWIPE_THRESHOLD = 50;
const DRAG_MAX = 80;
const SLIDE_DURATION_MS = 250;

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 초기값: 2026년 3월 (month 0-based)
const initial = new Date(2026, 2, 1);

export function TossCalendar() {
  const [viewDate, setViewDate] = useState(initial);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);
  const nextMonth = useCallback(() => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const dragStart = useRef<{ x: number; isTouch: boolean } | null>(null);

  const handleDragStart = useCallback((x: number, isTouch: boolean) => {
    dragStart.current = { x, isTouch };
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    const start = dragStart.current;
    if (!start) return;
    const dx = clientX - start.x;
    const clamped = Math.max(-DRAG_MAX, Math.min(DRAG_MAX, dx));
    setDragOffset(clamped);
  }, []);

  const handleDragEnd = useCallback(
    (x: number, isTouch: boolean) => {
      const start = dragStart.current;
      dragStart.current = null;
      setIsDragging(false);
      if (!start || start.isTouch !== isTouch) {
        setDragOffset(0);
        return;
      }
      const dx = x - start.x;
      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        if (dx > 0) {
          prevMonth();
          setDragOffset(DRAG_MAX);
        } else {
          nextMonth();
          setDragOffset(-DRAG_MAX);
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setDragOffset(0));
        });
      } else {
        setDragOffset(0);
      }
    },
    [prevMonth, nextMonth]
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.targetTouches[0].clientX, true);
  }, [handleDragStart]);
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (dragStart.current?.isTouch) {
        handleDragMove(e.targetTouches[0].clientX);
        e.preventDefault();
      }
    },
    [handleDragMove]
  );
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches[0]) handleDragEnd(e.changedTouches[0].clientX, true);
    },
    [handleDragEnd]
  );
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => handleDragStart(e.clientX, false),
    [handleDragStart]
  );
  const onMouseUp = useCallback(
    (e: React.MouseEvent) => handleDragEnd(e.clientX, false),
    [handleDragEnd]
  );
  const onMouseLeave = useCallback(() => {
    if (dragStart.current && !dragStart.current.isTouch) {
      handleDragEnd(dragStart.current.x, false);
    }
    dragStart.current = null;
  }, [handleDragEnd]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragStart.current && !dragStart.current.isTouch) handleDragMove(e.clientX);
    };
    const onUp = (e: MouseEvent) => {
      if (dragStart.current && !dragStart.current.isTouch) handleDragEnd(e.clientX, false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (!selectedDate) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [selectedDate]);

  const { daysInMonth, startDayOfWeek, monthName } = useMemo(() => {
    const d = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    return {
      daysInMonth: last.getDate(),
      startDayOfWeek: d.getDay(),
      monthName: `${year}년 ${MONTH_NAMES[month]}`,
    };
  }, [year, month]);

  const today = useMemo(() => new Date(), []);

  const cells = useMemo(() => {
    const list: { type: 'empty' | 'day'; day?: number }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) list.push({ type: 'empty' });
    for (let day = 1; day <= daysInMonth; day++) list.push({ type: 'day', day });
    return list;
  }, [startDayOfWeek, daysInMonth]);

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  const isSelected = (day: number) =>
    selectedDate
      ? selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === day
      : false;
  const hasContentForDay = (day: number) => {
    const d = new Date(year, month, day);
    // 2026년 3월 4일에만 컨텐츠가 있음
    return (
      d.getFullYear() === 2026 &&
      d.getMonth() === 2 && // 0=1월, 2=3월
      d.getDate() === 4
    );
  };

  const isSpecialMatch =
    selectedDate &&
    selectedDate.getFullYear() === 2026 &&
    selectedDate.getMonth() === 2 && // 0=1월, 2=3월
    selectedDate.getDate() === 4;

  const closeModal = useCallback(() => setSelectedDate(null), []);

  const formatModalDate = (d: Date) =>
    `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  return (
    <>
    <div className="toss-calendar-wrapper">
      <div
        className="toss-calendar"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="toss-calendar-inner"
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? 'none' : `transform ${SLIDE_DURATION_MS}ms ease-out`,
          }}
        >
        <div className="toss-calendar-header">
          <button type="button" className="toss-calendar-nav" onClick={prevMonth} aria-label="이전 달">‹</button>
          <span className="toss-calendar-month">{monthName}</span>
          <button type="button" className="toss-calendar-nav" onClick={nextMonth} aria-label="다음 달">›</button>
        </div>
        <div className="toss-calendar-grid">
          {WEEKDAYS.map((day) => (
            <div key={day} className="toss-calendar-weekday">
              {day}
            </div>
          ))}
          {cells.map((cell, i) =>
            cell.type === 'empty' ? (
              <div key={`e-${i}`} className="toss-calendar-day empty" />
            ) : (
              <button
                key={`d-${cell.day}`}
                type="button"
                className={`toss-calendar-day
                  ${isToday(cell.day!) ? 'today' : ''}
                  ${isSelected(cell.day!) ? 'selected' : ''}
                  ${hasContentForDay(cell.day!) ? 'has-content' : ''}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(new Date(year, month, cell.day!));
                }}
              >
                {cell.day}
              </button>
            )
          )}
        </div>
        </div>
      </div>
    </div>

    {selectedDate && (
      <div
        className="toss-calendar-modal-backdrop"
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-label="날짜 상세"
      >
        <div
          className="toss-calendar-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="toss-calendar-modal-header">
            <h3 className="toss-calendar-modal-title">{formatModalDate(selectedDate)}</h3>
            <button
              type="button"
              className="toss-calendar-modal-close"
              onClick={closeModal}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <div className="toss-calendar-modal-body">
            {isSpecialMatch && (
              <div className="toss-calendar-modal-match">
                <p className="toss-calendar-modal-match-title">
                  3월 4일 수요일 21:00
                </p>
                <p className="toss-calendar-modal-match-venue">
                  서울 지니 풋살파크 중화점 실내구장
                </p>
                <a
                  href="https://www.plabfootball.com/match/807784/"
                  target="_blank"
                  rel="noreferrer"
                  className="toss-calendar-modal-cta"
                >
                  신청 바로가기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
