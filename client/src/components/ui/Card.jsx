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
    if (glass) return 'bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl'
    if (gradient) return 'bg-gradient-to-br from-white via-gray-50/80 to-white border border-gray-100/50'
    return 'bg-white border border-gray-100/50'
  }

  return (
    <div
      className={`
        ${getBaseStyles()} 
        rounded-2xl shadow-lg shadow-gray-200/40 overflow-hidden
        ${hover ? 'hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 cursor-pointer' : ''}
        ${glow ? 'hover:shadow-glow-primary' : ''}
        ${bordered ? 'border-2 border-primary-100 hover:border-primary-300' : ''}
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
  <div className={`${noBorder ? '' : 'border-b border-gray-100/80'} pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '', gradient = false, ...props }) => (
  <h3 
    className={`text-lg font-bold ${gradient ? 'bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent' : 'text-gray-900'} ${className}`} 
    {...props}
  >
    {children}
  </h3>
)

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-500 mt-1.5 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
)

const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '', noBorder = false, ...props }) => (
  <div className={`${noBorder ? '' : 'border-t border-gray-100/80'} pt-4 mt-4 ${className}`} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
