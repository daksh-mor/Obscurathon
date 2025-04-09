import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  as = 'button',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-300',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline p-0',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300'
  };
  
  const LoadingSpinner = () => (
    <svg 
      className={`animate-spin -ml-1 mr-2 h-4 w-4 ${variant === 'link' ? 'text-primary-600' : 'text-white'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  const content = (
    <>
      {isLoading && <LoadingSpinner />}
      {icon && iconPosition === 'left' && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );
  
  const Component = as === 'button' ? motion.button : motion[as];
  
  return (
    <Component
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;