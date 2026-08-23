-- Nivel de stock como columna generada, para poder filtrar y contar en servidor.
--
-- El filtro de la pantalla de materiales compara DOS columnas
-- (`stock - min_stock < 10`). PostgREST no sabe expresar eso: en
-- `.lt("stock", "min_stock")` el segundo argumento se interpreta como literal,
-- no como columna. Sin esto no se puede paginar el listado, porque el filtro
-- tendría que seguir aplicándose en cliente sobre la página ya recortada.
--
-- `COALESCE` no es opcional: `stock` y `min_stock` admiten nulos, y el cliente
-- los trataba como 0 (`Number(item.stock ?? 0)`). Sin el COALESCE un material
-- con stock nulo se clasificaría como 'optimal' en vez de 'critical'.
--
-- OJO: el umbral 10 vive ahora en tres sitios — aquí, en el trigger de alertas
-- (`011_inventory_alerts.sql`) y en `getInventoryStockLevel` de TypeScript, que
-- sigue usándose para pintar las etiquetas. Si cambia, hay que cambiarlo en los
-- tres o la lista filtrará distinto de lo que muestra.
ALTER TABLE inventory_items
  ADD COLUMN stock_level TEXT GENERATED ALWAYS AS (
    CASE
      WHEN COALESCE(stock, 0) <= 0 THEN 'critical'
      WHEN COALESCE(stock, 0) - COALESCE(min_stock, 0) < 10 THEN 'low'
      ELSE 'optimal'
    END
  ) STORED;

-- Filtrar por nivel dentro de una clínica, que es lo que hacen las tarjetas de
-- crítico/bajo/óptimo al pulsarlas, y los tres recuentos de la cabecera.
CREATE INDEX idx_inventory_items_clinic_stock_level
  ON inventory_items (clinic_id, stock_level);

-- Orden estable del listado paginado: `name` como orden visible e `id` como
-- desempate, para que una fila no se repita entre páginas.
CREATE INDEX idx_inventory_items_clinic_name
  ON inventory_items (clinic_id, name, id);
