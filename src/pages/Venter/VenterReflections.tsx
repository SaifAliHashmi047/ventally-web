import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useReflections } from '../../api/hooks/useReflections';
import { Plus, ChevronRight, BookOpen } from 'lucide-react';

export const VenterReflections = () => {
  const navigate = useNavigate();
  const { getReflectionHistory } = useReflections();
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  const fetchReflections = async (offset = 0) => {
    try {
      const res = await getReflectionHistory(LIMIT, offset);
      const items = res?.reflections ?? [];
      if (offset === 0) setReflections(items);
      else setReflections(prev => [...prev, ...items]);
      setHasMore(items.length === LIMIT);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReflections(0); }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReflections(nextPage * LIMIT);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Reflections"
        rightContent={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/venter/reflections/add')}>
            Add
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : reflections.length === 0 ? (
        <EmptyState
          title="No reflections yet"
          description="Write your first reflection to start your mindfulness journey."
          icon={<BookOpen size={22} />}
          action={<Button variant="accent" size="sm" onClick={() => navigate('/venter/reflections/add')}>Write First Reflection</Button>}
        />
      ) : (
        <div className="space-y-3">
          {reflections.map((r: any) => (
            <GlassCard
              key={r.id}
              hover
              onClick={() => navigate(`/venter/reflections/${r.id}`, { state: { reflection: r } })}
              padding="md"
              rounded="2xl"
              className="cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
                  <BookOpen size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white line-clamp-2">{r.reflection_text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(r.reflection_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-500 flex-shrink-0 mt-1" />
              </div>
            </GlassCard>
          ))}

          {hasMore && (
            <Button variant="glass" fullWidth onClick={loadMore}>
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
