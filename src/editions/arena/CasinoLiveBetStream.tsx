import React, { useState } from 'react';
import { Copy, Flame, Pause, Play, Radio } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { SportIcon, UsdtBadge } from '../../components/BrandIcons';

export const CasinoLiveBetStream: React.FC<{
  isPhoneView?: boolean;
  matchIdFilter?: string;
}> = ({ isPhoneView = false, matchIdFilter }) => {
  const {
    liveStreamTickets,
    isStreamPaused,
    setIsStreamPaused,
    mirrorStreamTicket,
    isSelected,
    navigateTo,
  } = useSportsbook();

  const [tab, setTab] = useState<'all' | 'high-roller'>('all');

  const filtered = liveStreamTickets.filter((t) => {
    if (matchIdFilter && t.selection.matchId !== matchIdFilter) return false;
    if (tab === 'high-roller' && !t.isHighRoller) return false;
    return true;
  });

  const displayList =
    filtered.length > 0 ? filtered.slice(0, 6) : liveStreamTickets.slice(0, 5);

  return (
    <div
      onMouseEnter={() => setIsStreamPaused(true)}
      onMouseLeave={() => setIsStreamPaused(false)}
      className="rounded-[14px] bg-[#08161E] border border-[#173544] overflow-hidden"
    >
      {/* Housebets Casino-Native Live Bet Tape Header */}
      <div className="px-3.5 py-2.5 bg-[#0B1E28] border-b border-[#163342] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2CE5F6] animate-pulse" />
          <span className="text-[13px] font-extrabold text-white tracking-tight">
            Housebets Live Singles Stream
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#112F3D] text-[#8CE9D8] text-[10px] font-extrabold uppercase">
            USDT Tape
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-[#061117] p-0.5 rounded-[8px] border border-[#163342]">
            <button
              type="button"
              onClick={() => setTab('all')}
              className={`h-6 px-2.5 rounded-[6px] text-[11px] font-extrabold transition-colors ${
                tab === 'all'
                  ? 'bg-[#143949] text-white'
                  : 'text-[#7F9EAC] hover:text-white'
              }`}
            >
              All Singles
            </button>
            <button
              type="button"
              onClick={() => setTab('high-roller')}
              className={`h-6 px-2.5 rounded-[6px] text-[11px] font-extrabold flex items-center gap-1 transition-colors ${
                tab === 'high-roller'
                  ? 'bg-[#143949] text-[#F5B82E]'
                  : 'text-[#7F9EAC] hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-[#F5B82E]" />
              <span>High Rollers</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsStreamPaused((p) => !p)}
            className="h-7 px-2 rounded-[7px] bg-[#0D222D] border border-[#193948] text-[10.5px] font-bold text-[#9AB7C4] hover:text-white flex items-center gap-1"
            title={isStreamPaused ? 'Resume live stream' : 'Pause live stream'}
          >
            {isStreamPaused ? (
              <>
                <Play className="w-3 h-3 text-[#2CE5F6]" />
                <span>Paused</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-[#8CE9D8]" />
                <span>Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Casino-Style Table vs Mobile Compact Feed */}
      {isPhoneView ? (
        <div className="divide-y divide-[#122935]">
          {displayList.map((ticket) => {
            const inSlip = isSelected(ticket.selection.id);
            return (
              <div
                key={ticket.id}
                className="p-2.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7D9CA9]">
                    <SportIcon
                      sport={ticket.selection.sportId}
                      className="w-3 h-3 text-[#2CE5F6]"
                    />
                    <span className="truncate">{ticket.selection.matchTitle}</span>
                    <span>· {ticket.timeLabel}</span>
                  </div>
                  <div className="text-[12px] font-extrabold text-white truncate mt-0.5">
                    {ticket.selection.label}{' '}
                    <span className="text-[#3AD4F7] tabular-nums">
                      @ {ticket.selection.odds.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#B9F6EC] tabular-nums flex items-center gap-1 mt-0.5">
                    <UsdtBadge className="w-3 h-3" />
                    <span>
                      ${ticket.stake.toFixed(2)} → $
                      {ticket.potentialReturn.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => mirrorStreamTicket(ticket)}
                  className={`h-8 px-2.5 rounded-[8px] text-[11px] font-extrabold flex items-center gap-1 shrink-0 ${
                    inSlip
                      ? 'bg-[#143D4F] border border-[#2CE5F6] text-[#2CE5F6]'
                      : 'bg-[#0D2430] border border-[#1C3F50] text-white'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                  <span>{inSlip ? 'In Slip' : 'Mirror'}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#132B37] text-[10px] font-extrabold uppercase tracking-wider text-[#6D8E9C] bg-[#07131B]">
                <th className="py-2 px-3.5">Ticket</th>
                <th className="py-2 px-3">Event &amp; Market</th>
                <th className="py-2 px-3">Single Selection</th>
                <th className="py-2 px-3 text-right">Odds</th>
                <th className="py-2 px-3 text-right">USDT Stake</th>
                <th className="py-2 px-3 text-right">Potential Return</th>
                <th className="py-2 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#112733] text-[12px]">
              {displayList.map((ticket) => {
                const inSlip = isSelected(ticket.selection.id);
                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-[#0B1D27] transition-colors"
                  >
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="font-extrabold text-[#DCEAF0] tabular-nums flex items-center gap-1.5">
                        {ticket.isHighRoller && (
                          <Flame className="w-3.5 h-3.5 text-[#F5B82E]" />
                        )}
                        <span>{ticket.ticketCode}</span>
                      </div>
                      <div className="text-[10px] text-[#6B8B99]">
                        {ticket.playerAlias} · {ticket.timeLabel}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() =>
                          navigateTo('match', {
                            matchId: ticket.selection.matchId,
                          })
                        }
                        className="flex items-center gap-1.5 font-bold text-white hover:text-[#2CE5F6] transition-colors text-left"
                      >
                        <SportIcon
                          sport={ticket.selection.sportId}
                          className="w-3.5 h-3.5 text-[#2CE5F6] shrink-0"
                        />
                        <span className="truncate max-w-[210px]">
                          {ticket.selection.matchTitle}
                        </span>
                      </button>
                      <div className="text-[10.5px] text-[#7A9AA8]">
                        {ticket.selection.marketName}
                        {ticket.selection.isLive && (
                          <span className="ml-1.5 text-[#FF5C85] font-bold">
                            · Live
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-extrabold text-white">
                      {ticket.selection.label}
                    </td>

                    <td className="py-2.5 px-3 text-right font-extrabold text-[#3AD4F7] tabular-nums">
                      {ticket.selection.odds.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-[#DCEAF0] tabular-nums whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <UsdtBadge className="w-3.5 h-3.5" />
                        ${ticket.stake.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-extrabold text-[#B9F6EC] tabular-nums whitespace-nowrap">
                      ${ticket.potentialReturn.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => mirrorStreamTicket(ticket)}
                        className={`h-7 px-2.5 rounded-[7px] text-[11px] font-extrabold inline-flex items-center gap-1 transition-colors ${
                          inSlip
                            ? 'bg-[#153F50] border border-[#2CE5F6] text-[#2CE5F6]'
                            : 'bg-[#0E2531] hover:bg-[#15384A] border border-[#1D4050] text-white'
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        <span>{inSlip ? 'In Slip' : 'Mirror'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
