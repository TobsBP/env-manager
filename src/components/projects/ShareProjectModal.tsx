'use client';

import { useEffect, useState } from 'react';
import {
	addProjectMember,
	getProjectMembers,
	removeProjectMember,
	updateProjectMemberRole,
} from '@/lib/projects/share-actions';
import type { ShareProjectModalProps } from '@/types/interfaces/modals';
import type { ProjectMember } from '@/types/interfaces/project';

export function ShareProjectModal({
	projectId,
	onClose,
}: ShareProjectModalProps) {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
	const [isAdding, setIsAdding] = useState(false);
	const [addError, setAddError] = useState<string | null>(null);

	const [members, setMembers] = useState<ProjectMember[]>([]);
	const [isLoadingMembers, setIsLoadingMembers] = useState(true);
	const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

	useEffect(() => {
		getProjectMembers(projectId).then((res) => {
			if (res.success) setMembers(res.members);
			setIsLoadingMembers(false);
		});
	}, [projectId]);

	async function handleAdd() {
		const trimmed = email.trim();
		if (!trimmed || isAdding) return;
		setIsAdding(true);
		setAddError(null);

		const result = await addProjectMember(projectId, trimmed, role);
		setIsAdding(false);

		if (result.success) {
			setEmail('');
			// Refresh members list
			const res = await getProjectMembers(projectId);
			if (res.success) setMembers(res.members);
		} else {
			setAddError(result.error);
		}
	}

	async function handleRemove(uid: string) {
		const result = await removeProjectMember(projectId, uid);
		if (result.success) {
			setMembers((prev) => prev.filter((m) => m.uid !== uid));
			setConfirmRemove(null);
		}
	}

	async function handleRoleChange(uid: string, newRole: 'viewer' | 'editor') {
		const result = await updateProjectMemberRole(projectId, uid, newRole);
		if (result.success) {
			setMembers((prev) =>
				prev.map((m) => (m.uid === uid ? { ...m, role: newRole } : m)),
			);
		}
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop closes on click/Escape
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
			onKeyDown={(e) => e.key === 'Escape' && onClose()}
		>
			<div className="glass-card w-full max-w-md mx-4 p-6">
				<div className="flex items-center justify-between mb-1">
					<h2 className="text-xl font-semibold">Share Project</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
						aria-label="Close"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>
				<p className="text-sm text-zinc-400 mb-5">
					Invite others to view or edit this project.
				</p>

				{/* Add member */}
				<div className="flex gap-2 mb-2">
					<input
						type="email"
						className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition disabled:opacity-50"
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
						disabled={isAdding}
					/>
					<select
						value={role}
						onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
						disabled={isAdding}
						className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-violet-500/60 transition disabled:opacity-50"
					>
						<option value="viewer">Viewer</option>
						<option value="editor">Editor</option>
					</select>
					<button
						type="button"
						onClick={handleAdd}
						disabled={isAdding || !email.trim()}
						className="btn-primary shrink-0 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						style={{ width: 'auto' }}
					>
						{isAdding ? '…' : 'Share'}
					</button>
				</div>

				{addError && <p className="text-xs text-red-400 mb-4">{addError}</p>}

				{/* Members list */}
				<div className="mt-5">
					<p className="text-xs text-zinc-500 mb-3 uppercase tracking-wide">
						People with access
					</p>

					{isLoadingMembers ? (
						<div className="space-y-2">
							{[1, 2].map((n) => (
								<div
									key={n}
									className="h-10 rounded-lg bg-white/5 animate-pulse"
								/>
							))}
						</div>
					) : members.length === 0 ? (
						<p className="text-sm text-zinc-600 text-center py-4">
							No one else has access yet.
						</p>
					) : (
						<ul className="space-y-2">
							{members.map((member) => (
								<li
									key={member.uid}
									className="flex items-center gap-3 rounded-lg bg-white/4 px-3 py-2.5"
								>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-zinc-200 truncate">
											{member.email}
										</p>
									</div>

									{confirmRemove === member.uid ? (
										<div className="flex items-center gap-1.5 shrink-0">
											<span className="text-xs text-zinc-400">Remove?</span>
											<button
												type="button"
												onClick={() => handleRemove(member.uid)}
												className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-all"
											>
												Yes
											</button>
											<button
												type="button"
												onClick={() => setConfirmRemove(null)}
												className="px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-all"
											>
												No
											</button>
										</div>
									) : (
										<div className="flex items-center gap-2 shrink-0">
											<select
												value={member.role}
												onChange={(e) =>
													handleRoleChange(
														member.uid,
														e.target.value as 'viewer' | 'editor',
													)
												}
												className="bg-zinc-800/80 border border-white/8 rounded-md px-2 py-1 text-xs text-zinc-300 outline-none focus:border-violet-500/60 transition"
											>
												<option value="viewer">Viewer</option>
												<option value="editor">Editor</option>
											</select>
											<button
												type="button"
												onClick={() => setConfirmRemove(member.uid)}
												className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
												aria-label="Remove member"
												title="Remove"
											>
												<svg
													width="13"
													height="13"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<polyline points="3 6 5 6 21 6" />
													<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
													<path d="M10 11v6M14 11v6" />
													<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
												</svg>
											</button>
										</div>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
