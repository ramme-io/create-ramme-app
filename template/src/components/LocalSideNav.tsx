import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon, type IconName } from '@ramme-io/ui';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
  children?: NavItem[];
}

interface LocalSideNavProps {
  navItems: NavItem[];
  className?: string;
  onLinkClick?: () => void; // 1. Add the optional prop
}

const LocalSideNav: React.FC<LocalSideNavProps> = ({ navItems, className, onLinkClick }) => { // 2. Destructure prop
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const currentParent = navItems.find(item => 
      item.children?.some(child => location.pathname === child.href)
    );
    if (currentParent) {
      setExpandedItems(prev => ({ ...prev, [currentParent.href]: true }));
    }
  }, [location.pathname, navItems]);

  const handleToggle = (href: string) => {
    setExpandedItems(prev => ({ ...prev, [href]: !prev[href] }));
  };
  
  const childNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-sm transition-colors duration-200 py-1 ${
      isActive
        ? 'text-primary font-medium'
        : 'text-muted-foreground hover:text-text'
    }`;
  
  const renderNavLinks = (items: NavItem[]) => {
    return items.map(item => {
      const isExpanded = !!expandedItems[item.href];

      if (item.children) {
        return (
          //Section link
          <li key={item.href}>
            <button
              onClick={() => handleToggle(item.href)}
              className="flex w-full items-center justify-between gap-2 py-1 font-normal text-text transition-colors duration-200 hover:text-primary"
            >
              <span className="flex items-center gap-2">
                {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                <span className="text-md">{item.label}</span>
              </span>
              <Icon
                name="chevron-right"
                className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.ul
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto' },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-1 overflow-hidden border-l border-border pl-5 mt-1 ml-1"
                >
                  {item.children.map(child => (
                    <li key={child.href}>
                      <NavLink
                        to={child.href}
                        className={childNavLinkClasses}
                        onClick={onLinkClick} // 3. Add onClick to child NavLink
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        );
      }
      
      return (
        <li key={item.href}>
          <NavLink
            to={item.href}
            className="flex items-center gap-2 py-1 text-lg font-semibold"
            onClick={onLinkClick} // 3. Add onClick to top-level NavLink
          >
            {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
            {item.label}
          </NavLink>
        </li>
      );
    });
  };

  return (
    <nav className={`w-full ${className || ''}`}>
      <ul className="space-y-1">
        {renderNavLinks(navItems)}
      </ul>
    </nav>
  );
};

export default LocalSideNav;