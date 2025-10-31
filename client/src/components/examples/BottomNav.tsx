import BottomNav from '../BottomNav';
import { Router } from 'wouter';

export default function BottomNavExample() {
  return (
    <Router>
      <div className="h-32 bg-background">
        <BottomNav />
      </div>
    </Router>
  );
}
