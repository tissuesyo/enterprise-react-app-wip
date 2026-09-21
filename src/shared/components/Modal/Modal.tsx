import { forwardRef, type ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  type DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppButton } from '@/shared/components/AppButton';

export interface ModalProps extends Omit<DialogProps, 'title' | 'onClose'> {
  /** 由 caller 傳入的標題文字/節點。 */
  title: ReactNode;
  /** 由 caller 傳入的內容模板。 */
  children: ReactNode;
  /** 除了預設取消鈕以外，額外要顯示的按鈕（例如「確定」）。 */
  actions?: ReactNode;
  /** 關閉視窗：右上角 close icon、ESC、backdrop、預設取消鈕都會呼叫這個函式。 */
  onClose: () => void;
  /** 特殊需求才需要關閉右上角 close icon，預設一律顯示。 */
  hideCloseButton?: boolean;
  /** 是否顯示預設取消鈕（primary 色系的 outlined 按鈕），預設顯示。 */
  showCancelButton?: boolean;
  /** 預設取消鈕文字。 */
  cancelButtonLabel?: string;
}

/**
 * 全站共用的 Modal。標題底色/文字色由 theme 的 MuiDialogTitle override 統一控管
 * （見 shared/theme/componentOverrides.ts）。按鈕列預設會有一顆置中的「取消」鈕
 * （primary outlined，點擊即呼叫 onClose），額外的按鈕（例如「確定」）透過 actions 傳入，
 * 會與取消鈕並排、一起置中。
 *
 * 範例：
 *   <Modal open={open} onClose={handleClose} title="Delete user?">
 *     <Typography variant="body2">確定要刪除這筆資料嗎？</Typography>
 *   </Modal>
 *
 *   // 需要額外的「確定」按鈕：
 *   <Modal
 *     open={open}
 *     onClose={handleClose}
 *     title="Delete user?"
 *     actions={<AppButton intent="danger" onClick={handleConfirm}>確定</AppButton>}
 *   >
 *     ...
 *   </Modal>
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    title,
    children,
    actions,
    onClose,
    hideCloseButton = false,
    showCancelButton = true,
    cancelButtonLabel = '取消',
    ...dialogProps
  },
  ref,
) {
  const hasActionRow = showCancelButton || Boolean(actions);

  return (
    <Dialog ref={ref} onClose={() => onClose()} {...dialogProps}>
      <DialogTitle sx={{ justifyContent: 'space-between' }}>
        {title}
        {!hideCloseButton && (
          <IconButton onClick={onClose} size="small" sx={{ color: 'inherit' }} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {hasActionRow && (
        <DialogActions sx={{ justifyContent: 'center' }}>
          {showCancelButton && (
            <AppButton intent="primary" variant="outlined" onClick={onClose}>
              {cancelButtonLabel}
            </AppButton>
          )}
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
});
