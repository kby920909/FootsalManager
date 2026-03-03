package com.tosscalendar.app

import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.widget.GridLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GestureDetectorCompat
import com.tosscalendar.app.databinding.ActivityMainBinding
import java.util.Calendar

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    private var displayYear = 2026
    private var displayMonth = Calendar.MARCH // 2 = March

    private var touchStartX = 0f
    private var touchStartTranslationX = 0f
    private val dragMaxPx: Float get() = 80 * resources.displayMetrics.density

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        updateMonthText()
        setupWeekdays()
        fillCalendarGrid()

        binding.tossCalendarPrev.setOnClickListener { goPrevMonth(); playSlideIn(1) }
        binding.tossCalendarNext.setOnClickListener { goNextMonth(); playSlideIn(-1) }

        val gestureDetector = GestureDetectorCompat(
            this,
            object : android.view.GestureDetector.SimpleOnGestureListener() {
                override fun onFling(
                    e1: MotionEvent?,
                    e2: MotionEvent,
                    velocityX: Float,
                    velocityY: Float
                ): Boolean {
                    if (e1 == null) return false
                    val minVelocity = 200
                    val minDistance = dp(40)
                    val dx = e2.x - e1.x
                    if (kotlin.math.abs(dx) < minDistance) return false
                    if (kotlin.math.abs(velocityX) < minVelocity) return false
                    if (dx > 0) {
                        goPrevMonth()
                        playSlideIn(1)
                    } else {
                        goNextMonth()
                        playSlideIn(-1)
                    }
                    return true
                }
            }
        )
        binding.tossCalendarCard.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    touchStartX = event.x
                    touchStartTranslationX = binding.tossCalendarCard.translationX
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = event.x - touchStartX
                    val clamped = dx.coerceIn(-dragMaxPx, dragMaxPx)
                    binding.tossCalendarCard.translationX = touchStartTranslationX + clamped
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> { }
            }
            val consumed = gestureDetector.onTouchEvent(event)
            if (event.action == MotionEvent.ACTION_UP || event.action == MotionEvent.ACTION_CANCEL) {
                if (!consumed) animateTranslationToZero()
            }
            false
        }
    }

    private fun playSlideIn(direction: Int) {
        val start = (direction * 80 * resources.displayMetrics.density)
        binding.tossCalendarCard.translationX = start
        binding.tossCalendarCard.animate()
            .translationX(0f)
            .setDuration(250)
            .start()
    }

    private fun animateTranslationToZero() {
        binding.tossCalendarCard.animate()
            .translationX(0f)
            .setDuration(200)
            .start()
    }

    private fun updateMonthText() {
        binding.tossCalendarMonth.text = getString(R.string.calendar_month_format, displayYear, displayMonth + 1)
    }

    private fun goPrevMonth() {
        if (displayMonth == Calendar.JANUARY) {
            displayYear--
            displayMonth = Calendar.DECEMBER
        } else {
            displayMonth--
        }
        updateMonthText()
        fillCalendarGrid()
    }

    private fun goNextMonth() {
        if (displayMonth == Calendar.DECEMBER) {
            displayYear++
            displayMonth = Calendar.JANUARY
        } else {
            displayMonth++
        }
        updateMonthText()
        fillCalendarGrid()
    }

    private fun setupWeekdays() {
        val weekdays = listOf("일", "월", "화", "수", "목", "금", "토")
        binding.tossCalendarWeekdays.removeAllViews()
        for (i in weekdays.indices) {
            val tv = TextView(this).apply {
                text = weekdays[i]
                setTextColor(getColor(R.color.toss_text_secondary))
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
                setTypeface(null, android.graphics.Typeface.BOLD)
                gravity = Gravity.CENTER
                setPadding(dp(8), dp(12), dp(8), dp(12))
            }
            val params = GridLayout.LayoutParams().apply {
                width = 0
                height = GridLayout.LayoutParams.WRAP_CONTENT
                columnSpec = GridLayout.spec(i, 1f)
                rowSpec = GridLayout.spec(0)
            }
            binding.tossCalendarWeekdays.addView(tv, params)
        }
    }

    private fun fillCalendarGrid() {
        binding.tossCalendarGrid.removeAllViews()

        val cal = Calendar.getInstance().apply {
            set(displayYear, displayMonth, 1)
        }
        val firstDayOfWeek = cal.get(Calendar.DAY_OF_WEEK) - 1
        val daysInMonth = cal.getActualMaximum(Calendar.DAY_OF_MONTH)

        val today = Calendar.getInstance()
        val todayYear = today.get(Calendar.YEAR)
        val todayMonth = today.get(Calendar.MONTH)
        val todayDay = today.get(Calendar.DATE)

        for (i in 0 until firstDayOfWeek) {
            binding.tossCalendarGrid.addView(emptyCell(), gridParams(i))
        }
        for (day in 1..daysInMonth) {
            val idx = firstDayOfWeek + (day - 1)
            val isToday = displayYear == todayYear && displayMonth == todayMonth && day == todayDay
            binding.tossCalendarGrid.addView(dayCell(day, isToday), gridParams(idx))
        }
    }

    private fun gridParams(index: Int): GridLayout.LayoutParams {
        val row = index / 7
        val col = index % 7
        return GridLayout.LayoutParams().apply {
            width = 0
            height = dp(44)
            columnSpec = GridLayout.spec(col, 1f)
            rowSpec = GridLayout.spec(row)
            setMargins(dp(2), dp(2), dp(2), dp(2))
        }
    }

    private fun emptyCell(): View {
        return View(this)
    }

    private fun dayCell(day: Int, isToday: Boolean): View {
        val tv = TextView(this).apply {
            text = day.toString()
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(8), dp(8), dp(8))
        }
        if (isToday) {
            tv.setBackgroundResource(R.drawable.bg_calendar_today)
            tv.setTextColor(getColor(android.R.color.white))
            tv.setTypeface(null, android.graphics.Typeface.BOLD)
        } else {
            tv.setBackgroundResource(R.drawable.bg_calendar_day)
            tv.setTextColor(getColor(R.color.toss_text_primary))
        }
        return tv
    }

    private fun dp(px: Int): Int {
        return (px * resources.displayMetrics.density).toInt()
    }
}
