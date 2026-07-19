# Project Agent Rules

File ini adalah ringkasan aturan inti. Detail aturan ada di `rules/*.mdx`.

## Wajib Dibaca

- Sebelum mengerjakan task, baca `AGENTS.md`, `rules.md` jika ada, dan semua file `rules/**/*.mdx` jika ada.
- Jika ada konflik aturan, ikuti aturan yang lebih spesifik dan lebih ketat. Instruksi user terbaru tetap menjadi konteks utama selama tidak bertentangan dengan system/developer instructions.

## Aturan Inti

- Prioritas utama: untuk library, dependency, build tool, router, atau API framework, gunakan Context7 sebelum membuat kode, setup, konfigurasi, atau keputusan teknis. Wajib resolve Library ID dulu, lalu ambil docs dari Context7.
- Prioritas utama: untuk Vuetify, gunakan Vuetify MCP sebelum membuat kode, setup, konfigurasi, atau keputusan teknis terkait Vuetify.
- Jangan mengikuti project referensi secara literal jika stack referensinya deprecated, bukan jalur official terbaru, atau bertentangan dengan rules project ini.
- Perubahan major pada dependency, build config, router, atau tooling wajib dikonfirmasi dulu sebelum downgrade/upgrade besar.
- Jangan membuat, menghapus, atau mengubah file rules (`AGENTS.md`, `rules.md`, `rules/**/*.mdx`) kecuali user meminta eksplisit.
- Jangan running dev server kecuali user meminta atau memberi izin eksplisit. Fokus default ke unit test dan validasi CLI.
- Setelah perubahan code, jalankan `npm run type-check` dan `npm run lint`. Jalankan test yang relevan, dan `npm run test:run` untuk perubahan berisiko luas.
- `src/schemas/` adalah tempat schema validasi dan konfigurasi form. Boleh diubah jika task memang menyentuh validasi/form schema; jangan diubah untuk perubahan yang tidak terkait.
- Jangan buat interface/type di component. Simpan type domain dan payload API di `src/model`.
- Hindari `any`, file besar campur tanggung jawab, store Pinia pass-through, dan logic API yang tidak perlu dibuat global.
- State reaktif, computed, watcher, handler, transform route, filtering, dan flow form pada page/component wajib berada di `src/composable/use-*.ts`; `script setup` hanya untuk props/emits, import child component/type, serta wiring composable.
- Shell persisten seperti sidebar dan navigasi global adalah milik `src/layouts/` (atau child foldernya); topbar hanya berada di layout jika dipakai semua route, selain itu menjadi milik halaman/fiturnya. Layout membungkus `<router-view>`.
- Jika ada call API, gunakan Promise chain (`.then/.catch/.finally`), jangan `async/await`. Isi `catch` cukup `console.error` karena error handling utama ada di config API.
- Import `vue` dan `vue-router` tidak perlu karena sudah auto import.
- Untuk UI admin/dashboard, ikuti pola Vuetify yang rapi, familiar, responsif, dan tidak bergaya landing page kecuali diminta.
- Pastikan table Vuetify nyaman di mobile, input punya `name` stabil, textfield `density="compact"`, dan aksi krusial memakai dialog konfirmasi reusable.
- Saat locale berubah, refetch data API yang dipengaruhi locale pada halaman/komponen aktif.
- Hindari `console.log`. Pastikan tidak ada error atau warning browser akibat perubahan.

## Detail Rules

- `rules/01-process.mdx`: proses kerja, testing, lint, package install, dan dev server.
- `rules/02-architecture.mdx`: struktur folder, ownership type/schema, API, composable, dan Pinia.
- `rules/03-frontend.mdx`: aturan UI, Vuetify, form, table mobile, wording, dan dialog.
- `rules/04-ecosystem.mdx`: Context7, Vuetify MCP, dependency/tooling official docs, dan project referensi.
- `rules/05-i18n.mdx`: locale dan refetch data backend.
