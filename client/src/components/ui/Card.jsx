const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'default',
  glass = false,
  gradient = false,
  glow = false,
  bordered = false,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  const getBaseStyles = () => {
    if (glass) return 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-xl'
    if (gradient) return 'bg-gradient-to-br from-white via-slate-50/80 to-white dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 border border-slate-100/50 dark:border-slate-700/50'
    return 'bg-white dark:bg-slate-800 border border-slate-100/50 dark:border-slate-700/50'
  }

  return (
    <div
      className={`
        ${getBaseStyles()} 
        rounded-2xl shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 overflow-hidden
        ${hover ? 'hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer' : ''}
        ${glow ? 'hover:shadow-glow-primary' : ''}
        ${bordered ? 'border-2 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600' : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '', noBorder = false, ...props }) => (
  <div className={`${noBorder ? '' : 'border-b border-slate-100/80 dark:border-slate-700/80'} pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '', gradient = false, ...props }) => (
  <h3 
    className={`text-lg font-bold ${gradient ? 'bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white bg-clip-text text-transparent' : 'text-slate-900 dark:text-white'} ${className}`} 
    {...props}
  >
    {children}
  </h3>
)

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
)

const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '', noBorder = false, ...props }) => (
  <div className={`${noBorder ? '' : 'border-t border-slate-100/80 dark:border-slate-700/80'} pt-4 mt-4 ${className}`} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
