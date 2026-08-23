from fastapi import APIRouter, HTTPException
from app.database import get_all_history, get_history_by_id, delete_history_by_id, clear_all_history

router = APIRouter(prefix="/history", tags=["Analysis History"])

@router.get("")
async def list_history():
    records = get_all_history()
    return {
        "count": len(records),
        "history": records
    }

@router.get("/{record_id}")
async def get_history_item(record_id: int):
    item = get_history_by_id(record_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"History item #{record_id} not found.")
    return item

@router.delete("/{record_id}")
async def delete_history_item(record_id: int):
    success = delete_history_by_id(record_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"History item #{record_id} not found.")
    return {"success": True, "message": f"Deleted history item #{record_id}"}

@router.delete("")
async def clear_history():
    clear_all_history()
    return {"success": True, "message": "Cleared all history records."}
