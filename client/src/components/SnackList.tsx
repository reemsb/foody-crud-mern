import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Snack } from '../models/snack';
import useSnackStore from '../stores/snackStore';
import SnackForm from './SnackForm';
import { formatDate, formatTime, formatDayHeader } from '../utils/utilsUI';
import { api } from '../api/client';
import './SnackList.scss';

type ViewMode = 'grid' | 'diary';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96 },
};

function groupByDay(snacks: Snack[]): Array<{ key: string; date: Date; items: Snack[] }> {
  const groups = new Map<string, { date: Date; items: Snack[] }>();
  for (const snack of snacks) {
    const d = new Date(snack.lastDayConsumed);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const group = groups.get(key);
    if (group) {
      group.items.push(snack);
    } else {
      groups.set(key, { date: d, items: [snack] });
    }
  }
  return Array.from(groups.entries())
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((group) => ({
      ...group,
      items: group.items.sort(
        (a, b) =>
          new Date(b.lastDayConsumed).getTime() -
          new Date(a.lastDayConsumed).getTime(),
      ),
    }));
}

function SnackList() {
  const snacks = useSnackStore((state) => state.snacks);
  const setSnacks = useSnackStore((state) => state.setSnacks);
  const removeSnackFromStore = useSnackStore((state) => state.removeSnack);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | undefined>();
  const [searchName, setSearchName] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const openCreateForm = useCallback(() => {
    setSelectedSnack(undefined);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((snack: Snack) => {
    setSelectedSnack({ ...snack });
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => setShowForm(false), []);

  const openDeleteModal = useCallback((snack: Snack) => {
    setSelectedSnack(snack);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const handleDelete = useCallback(
    async (snackId: string) => {
      try {
        const { data } = await api.delete(`/snacks/${snackId}`);
        removeSnackFromStore(snackId);
        toast.success(`${data.name} was deleted`);
      } catch {
        toast.error('Could not delete snack');
      } finally {
        setShowDeleteModal(false);
      }
    },
    [removeSnackFromStore],
  );

  const refreshSnacks = useCallback(async () => {
    try {
      const { data } = await api.get<Snack[]>('/snacks');
      setSnacks(data);
    } catch {
      toast.error('Failed to load snacks');
    }
  }, [setSnacks]);

  useEffect(() => {
    refreshSnacks();
  }, [refreshSnacks]);

  const visibleSnacks = useMemo(() => {
    return snacks.filter((snack) => {
      if (favoritesOnly && !snack.isFavorite) return false;
      if (
        searchName &&
        !snack.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [snacks, favoritesOnly, searchName]);

  const diaryGroups = useMemo(
    () => (viewMode === 'diary' ? groupByDay(visibleSnacks) : []),
    [viewMode, visibleSnacks],
  );

  const favCount = useMemo(
    () => snacks.filter((s) => s.isFavorite).length,
    [snacks],
  );

  return (
    <div className="snacks-page">
      <div className="toolbar">
        <div className="toolbar-title">
          <h1>Your snacks</h1>
          <div className="count num">
            {snacks.length} {snacks.length === 1 ? 'item' : 'items'}
            {favCount > 0 && ` · ${favCount} favorite${favCount === 1 ? '' : 's'}`}
            {(searchName || favoritesOnly) &&
              ` · ${visibleSnacks.length} shown`}
          </div>
        </div>

        <div className="toolbar-actions">
          <Form className="search">
            <i className="bi bi-search search-icon" aria-hidden />
            <Form.Control
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search snacks…"
              aria-label="Search snacks"
            />
          </Form>

          <button
            type="button"
            className={`filter-pill ${favoritesOnly ? 'is-on' : ''}`}
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
          >
            <i
              className={`bi ${favoritesOnly ? 'bi-heart-fill' : 'bi-heart'}`}
              aria-hidden
            />
            <span>Favorites</span>
          </button>

          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={viewMode === 'grid' ? 'is-active' : ''}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <i className="bi bi-grid" aria-hidden />
            </button>
            <button
              type="button"
              className={viewMode === 'diary' ? 'is-active' : ''}
              onClick={() => setViewMode('diary')}
              aria-label="Diary view"
              aria-pressed={viewMode === 'diary'}
            >
              <i className="bi bi-journal-text" aria-hidden />
            </button>
          </div>

          <Button variant="primary" onClick={openCreateForm}>
            <i className="bi bi-plus-lg" aria-hidden />
            <span>New snack</span>
          </Button>
        </div>
      </div>

      {visibleSnacks.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-egg-fried empty-icon" aria-hidden />
          <div>
            {snacks.length === 0
              ? 'No snacks yet — add your first one.'
              : favoritesOnly && !searchName
                ? 'No favorites yet — tap the heart on a snack to add one.'
                : 'No snacks match your search.'}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div className="snack-grid" layout>
          <AnimatePresence mode="popLayout">
            {visibleSnacks.map((snack) => (
              <motion.article
                key={snack._id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  layout: { type: 'spring', stiffness: 400, damping: 30 },
                  opacity: { duration: 0.2 },
                  y: { duration: 0.25 },
                }}
                whileHover={{ y: -2 }}
                className="snack-card"
              >
                <div className="snack-head">
                  <div className="snack-name">{snack.name}</div>
                  <i
                    className={`bi ${
                      snack.isFavorite ? 'bi-heart-fill is-fav' : 'bi-heart'
                    } fav`}
                    aria-label={snack.isFavorite ? 'Favorite' : 'Not favorite'}
                  />
                </div>

                <div className="snack-meta">
                  <div className="meta-row">
                    <span className="meta-key">Last had</span>
                    <span className="meta-val">
                      {formatDate(snack.lastDayConsumed)}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Calories</span>
                    <span className="meta-val">
                      {snack.calories?.value ?? '—'}{' '}
                      <span className="text-muted">
                        {snack.calories?.unit ?? ''}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="snack-actions">
                  <Button
                    variant="secondary"
                    onClick={() => openEditForm(snack)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(snack)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div className="diary" layout>
          <AnimatePresence mode="popLayout">
            {diaryGroups.map((group) => {
              const header = formatDayHeader(group.date);
              return (
                <motion.section
                  key={group.key}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="diary-day"
                >
                  <div className="day-header">
                    <span className="day-pill" aria-hidden />
                    <span className="day-name">{header.name}</span>
                    <span className="day-date">{header.date}</span>
                    <span className="day-count">
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'snack' : 'snacks'}
                    </span>
                  </div>
                  <div className="day-items">
                    <AnimatePresence initial={false}>
                      {group.items.map((snack) => (
                        <motion.div
                          key={snack._id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.2 }}
                          className="diary-row"
                        >
                          <span className="diary-time">
                            {formatTime(snack.lastDayConsumed)}
                          </span>
                          <i
                            className={`bi ${
                              snack.isFavorite
                                ? 'bi-heart-fill is-fav'
                                : 'bi-heart'
                            } diary-fav`}
                            aria-label={
                              snack.isFavorite ? 'Favorite' : 'Not favorite'
                            }
                          />
                          <span className="diary-name">{snack.name}</span>
                          <span className="diary-cal">
                            {snack.calories?.value ?? '—'}
                            {' '}
                            <span style={{ color: 'var(--text-faint)' }}>
                              {snack.calories?.unit ?? ''}
                            </span>
                          </span>
                          <div className="diary-actions">
                            <button
                              type="button"
                              onClick={() => openEditForm(snack)}
                              aria-label="Edit snack"
                            >
                              <i className="bi bi-pencil" aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="danger"
                              onClick={() => openDeleteModal(snack)}
                              aria-label="Delete snack"
                            >
                              <i className="bi bi-trash" aria-hidden />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {selectedSnack && (
        <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete snack</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete{' '}
            <strong>{selectedSnack.name}</strong>? This can't be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedSnack._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <SnackForm
        showForm={showForm}
        selectedSnack={selectedSnack}
        onClose={closeForm}
      />
    </div>
  );
}

export default SnackList;
