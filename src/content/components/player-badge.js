import React from 'dom-chef'
import vipLevels from '../../shared/vip-levels'

export default ({ level = 0, role, bgColor, textColor, onClick }) => {
  let description

  switch (role) {
    case 'Creator': {
      description = 'Has created Repeek'
      break
    }
    case 'Developer': {
      description = 'Is part of Repeek developer team'
      break
    }
    case 'Code Contributor': {
      description = 'Has contributed to Repeek code'
      break
    }
    default: {
      description = `Has supported Repeek`
    }
  }

  return (
    <div>
      <span
        style={{
          background: bgColor || vipLevels[level].bgColor,
          color: textColor || vipLevels[level].textColor,
          cursor: 'help',
          padding: '2px 4px',
          fontSize: 10,
          borderRadius: 4,
          fontFamily:
            'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
          fontWeight: 'bold',
          display: 'inline-flex',
          gap: 2,
          alignItems: 'center'
        }}
        title={description}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={107}
          height={128}
          fill="none"
          viewBox="0 0 107 128"
          style={{
            height: 14,
            width: 'auto'
          }}
        >
          <path
            fill="currentColor"
            d="m39.343 69.778 4.795 10.993L46.012 63.9l-19.55-10.18v10.31l12.88 5.747Z"
          />
          <path
            fill="currentColor"
            d="M77.175 29.223 53.286 23.13v-.003L29.353 29.06 0 0l5.423 114.61 20.124-14.411 23.797 27.774-15.483-49.998-13.67 10.915-6.274-57.946 9.94 13.195 29.375-6.062v.002l29.337 6.26 10.06-13.395-6.698 58.172-13.597-11.008L56.513 128l23.986-27.613 20.024 14.548L106.724.363l-29.55 28.86Z"
          />
          <path
            fill="currentColor"
            d="M79.83 64.033v-10.31L60.276 63.9l1.876 16.873 4.794-10.992 12.882-5.748Z"
          />
        </svg>
        <span>
          Repeek{' '}
          {role ||
            `VIP ${level > 0 ? new Array(level).fill('★').join('') : ''}`}
        </span>
      </span>
    </div>
  )
}
