import { useState } from 'react';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import { useSubmitFeedback } from '@/hooks/useFeedback';

/**
 * FeedbackBar — rates AI outputs as accurate / partial / inaccurate.
 *
 * Props:
 *  entityType  — e.g. "insight" | "agent_output" | "strategy"
 *  entityId    — the id of the entity being rated
 *  agentName   — (optional) which agent produced this output
 *  compact     — when true, hides the label text and uses smaller icons
 */
export const FeedbackBar = ({ entityType, entityId, agentName, compact = false }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected]   = useState(null);
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleFeedback = (rating) => {
    setSelected(rating);
    submitFeedback(
      {
        entity_type: entityType,
        entity_id:   entityId,
        agent_name:  agentName,
        rating,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          // Reset "Thanks" message after 3 s
          setTimeout(() => setSubmitted(false), 3000);
        },
        onError: () => {
          setSelected(null);
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        <span className="text-green-600 font-medium">Thanks ★</span>
      </div>
    );
  }

  const iconSize = compact ? 14 : 18;

  const btn = (rating, Icon, hoverBg, hoverText, title) => (
    <button
      onClick={() => handleFeedback(rating)}
      disabled={isPending}
      title={title}
      className={`
        p-1 rounded transition-colors disabled:opacity-40
        ${selected === rating ? `${hoverBg} ${hoverText}` : 'hover:' + hoverBg}
      `}
    >
      <Icon
        size={iconSize}
        className={selected === rating ? hoverText : `text-gray-400 hover:${hoverText}`}
      />
    </button>
  );

  return (
    <div className={`flex items-center gap-0.5 ${compact ? '' : 'gap-1'}`}>
      {!compact && (
        <span className="text-xs text-gray-400 mr-1">Was this helpful?</span>
      )}
      {btn('accurate',   ThumbsUp,   'bg-green-100',  'text-green-600',  'Accurate'   )}
      {btn('partial',    Minus,       'bg-yellow-100', 'text-yellow-600', 'Partial'    )}
      {btn('inaccurate', ThumbsDown,  'bg-red-100',    'text-red-600',    'Inaccurate' )}
    </div>
  );
};

export default FeedbackBar;
