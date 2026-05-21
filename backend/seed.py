from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from app.db.session import SessionLocal, engine
from app.models import models
from app.core import auth

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ──────────────────────────────────────────────
    # ROLES
    # ──────────────────────────────────────────────
    if not db.query(models.Role).first():
        roles = [
            models.Role(nombre="Administrador", descripcion="Acceso total al sistema, gestión completa de usuarios, proyectos y configuración."),
            models.Role(nombre="Supervisor", descripcion="Gestión de proyectos, actividades, revisión de evidencias y aprobación de planos."),
            models.Role(nombre="Ingeniero", descripcion="Gestión de planos, documentación técnica y revisión de avances."),
            models.Role(nombre="Operario", descripcion="Registro de evidencias fotográficas, consulta de tareas y actividades asignadas."),
            models.Role(nombre="Contador", descripcion="Gestión presupuestaria, revisión de gastos y aprobación de documentos financieros."),
        ]
        db.add_all(roles)
        db.commit()

    roles = {r.nombre: r.id for r in db.query(models.Role).all()}

    # ──────────────────────────────────────────────
    # USUARIOS
    # ──────────────────────────────────────────────
    if not db.query(models.User).first():
        users = [
            models.User(nombre="Carlos Mendoza Ruiz", email="admin@constructora.com", telefono="+51 987 654 321", password=auth.get_password_hash("admin123"), rol_id=roles["Administrador"], estado="Activo"),
            models.User(nombre="Ana Lucía Fernández", email="ana.fernandez@constructora.com", telefono="+51 912 345 678", password=auth.get_password_hash("supervisor123"), rol_id=roles["Supervisor"], estado="Activo"),
            models.User(nombre="Miguel Ángel Torres", email="miguel.torres@constructora.com", telefono="+51 945 678 123", password=auth.get_password_hash("ingeniero123"), rol_id=roles["Ingeniero"], estado="Activo"),
            models.User(nombre="Rosa Beatríz Vargas", email="rosa.vargas@constructora.com", telefono="+51 978 123 456", password=auth.get_password_hash("operario123"), rol_id=roles["Operario"], estado="Activo"),
            models.User(nombre="Jorge Luis Paredes", email="jorge.paredes@constructora.com", telefono="+51 934 567 890", password=auth.get_password_hash("contador123"), rol_id=roles["Contador"], estado="Activo"),
            models.User(nombre="Luisa María Huamán", email="luisa.huaman@constructora.com", telefono="+51 967 890 123", password=auth.get_password_hash("operario123"), rol_id=roles["Operario"], estado="Activo"),
        ]
        db.add_all(users)
        db.commit()

    users_list = db.query(models.User).all()
    user_map = {u.email: u.id for u in users_list}
    admin_id = user_map["admin@constructora.com"]
    ana_id = user_map["ana.fernandez@constructora.com"]
    miguel_id = user_map["miguel.torres@constructora.com"]
    rosa_id = user_map["rosa.vargas@constructora.com"]
    jorge_id = user_map["jorge.paredes@constructora.com"]
    luisa_id = user_map["luisa.huaman@constructora.com"]

    # ──────────────────────────────────────────────
    # PROYECTOS (6 proyectos variados)
    # ──────────────────────────────────────────────
    if not db.query(models.Project).first():
        projects = [
            models.Project(
                nombre="Edificio Mirador Las Gardenias",
                descripcion="Construcción de edificio residencial de 15 pisos con 2 sótanos de estacionamiento. Incluye áreas comunes, gimnasio en azotea, jardines infantiles y sistema de tratamiento de aguas grises.",
                ubicacion="Av. La Marina 1245, San Isidro, Lima, Perú",
                cliente="Inmobiliaria ABC S.A.C.",
                fecha_inicio=date(2026, 1, 15),
                fecha_fin=date(2027, 6, 30),
                presupuesto=1500000,
                avance_total=35,
                estado="Activo",
                tipo="Residencial",
                responsable_id=admin_id
            ),
            models.Project(
                nombre="Planta Industrial Norte – Ampliación",
                descripcion="Ampliación de planta de procesamiento de 5,000 m². Incluye cuarto frío de 800 m², sistema contra incendios, subestación eléctrica de 500 KVA y oficinas administrativas de 300 m².",
                ubicacion="Av. Industrial 2500, Callao, Perú",
                cliente="Industrias XYZ S.A.",
                fecha_inicio=date(2026, 3, 1),
                fecha_fin=date(2026, 12, 31),
                presupuesto=2800000,
                avance_total=18,
                estado="Activo",
                tipo="Industrial",
                responsable_id=ana_id
            ),
            models.Project(
                nombre="Centro Comercial Plaza Sur",
                descripcion="Construcción de centro comercial de 3 niveles con 120 locales comerciales, food court para 600 personas, 4 salas de cine y estacionamiento subterráneo para 400 vehículos.",
                ubicacion="Km 15.5 Panamericana Sur, Chorrillos, Lima, Perú",
                cliente="Grupo Comercial del Sur S.A.",
                fecha_inicio=date(2025, 8, 1),
                fecha_fin=date(2027, 2, 28),
                presupuesto=8500000,
                avance_total=62,
                estado="Activo",
                tipo="Comercial",
                responsable_id=ana_id
            ),
            models.Project(
                nombre="Condominio Los Rosales",
                descripcion="Conjunto habitacional cerrado de 45 casas de 2 y 3 pisos. Incluye clubhouse, piscina semiolímpica, cancha de fútbol, parques infantiles y sistema de vigilancia perimetral con cámaras IP.",
                ubicacion="Urb. La Calera de la Merced, Surco, Lima, Perú",
                cliente="Inversiones Habitacionales Perú S.A.",
                fecha_inicio=date(2025, 6, 1),
                fecha_fin=date(2026, 8, 31),
                presupuesto=4200000,
                avance_total=78,
                estado="Activo",
                tipo="Residencial",
                responsable_id=miguel_id
            ),
            models.Project(
                nombre="Torre Empresarial Pacífico",
                descripcion="Edificio de oficinas de 22 pisos con certificación LEED. Fachada ventilada de vidrio templado, sistema VRF de climatización, generador eléctrico de 1,000 KVA y helipuerto en azotea.",
                ubicacion="Calle Las Orquídeas 475, San Isidro, Lima, Perú",
                cliente="Grupo Empresarial Pacífico S.A.",
                fecha_inicio=date(2025, 3, 1),
                fecha_fin=date(2026, 12, 31),
                presupuesto=12000000,
                avance_total=55,
                estado="Activo",
                tipo="Comercial",
                responsable_id=admin_id
            ),
            models.Project(
                nombre="Hospital Regional del Norte – Etapa II",
                descripcion="Construcción de segunda etapa: 3 quirófanos adicionales, UCI de 12 camas, banco de sangre, servicio de emergencia 24 horas y helipuerto. Área techada: 8,500 m².",
                ubicacion="Av. Panamericana Norte 4200, Trujillo, La Libertad, Perú",
                cliente="Gobierno Regional de La Libertad",
                fecha_inicio=date(2024, 9, 1),
                fecha_fin=date(2026, 6, 30),
                presupuesto=25000000,
                avance_total=85,
                estado="Activo",
                tipo="Industrial",
                responsable_id=miguel_id
            ),
            models.Project(
                nombre="Residencial Santa Patricia – En Pausa",
                descripcion="Proyecto residencial de 80 departamentos con vista al mar. Actualmente en pausa por reestructuración financiera y cambio de licencia de construcción.",
                ubicacion="Costa Verde, Barranco, Lima, Perú",
                cliente="Inmobiliaria Costa Azul S.A.",
                fecha_inicio=date(2025, 1, 1),
                fecha_fin=date(2026, 12, 31),
                presupuesto=6800000,
                avance_total=22,
                estado="En Pausa",
                tipo="Residencial",
                responsable_id=ana_id
            ),
        ]
        db.add_all(projects)
        db.commit()

    proj_list = db.query(models.Project).all()
    p_mirador = proj_list[0].id
    p_planta = proj_list[1].id
    p_plaza = proj_list[2].id
    p_rosales = proj_list[3].id
    p_torre = proj_list[4].id
    p_hospital = proj_list[5].id
    p_santa = proj_list[6].id

    # ──────────────────────────────────────────────
    # USUARIOS_PROYECTOS (asignaciones)
    # ──────────────────────────────────────────────
    if not db.query(models.UserProject).first():
        asignaciones = [
            models.UserProject(usuario_id=admin_id, proyecto_id=p_mirador, rol_proyecto="Residente"),
            models.UserProject(usuario_id=miguel_id, proyecto_id=p_mirador, rol_proyecto="Ing. Estructural"),
            models.UserProject(usuario_id=rosa_id, proyecto_id=p_mirador, rol_proyecto="Maestro de Obra"),
            models.UserProject(usuario_id=ana_id, proyecto_id=p_planta, rol_proyecto="Supervisora General"),
            models.UserProject(usuario_id=miguel_id, proyecto_id=p_planta, rol_proyecto="Ing. Civil"),
            models.UserProject(usuario_id=rosa_id, proyecto_id=p_planta, rol_proyecto="Seguridad"),
            models.UserProject(usuario_id=ana_id, proyecto_id=p_plaza, rol_proyecto="Supervisora General"),
            models.UserProject(usuario_id=luisa_id, proyecto_id=p_plaza, rol_proyecto="Control de Calidad"),
            models.UserProject(usuario_id=miguel_id, proyecto_id=p_rosales, rol_proyecto="Residente"),
            models.UserProject(usuario_id=rosa_id, proyecto_id=p_rosales, rol_proyecto="Maestro de Obra"),
            models.UserProject(usuario_id=admin_id, proyecto_id=p_torre, rol_proyecto="Gerente de Proyecto"),
            models.UserProject(usuario_id=ana_id, proyecto_id=p_torre, rol_proyecto="Supervisora"),
            models.UserProject(usuario_id=jorge_id, proyecto_id=p_torre, rol_proyecto="Control Presupuestal"),
            models.UserProject(usuario_id=miguel_id, proyecto_id=p_hospital, rol_proyecto="Residente"),
            models.UserProject(usuario_id=luisa_id, proyecto_id=p_hospital, rol_proyecto="Documentador"),
            models.UserProject(usuario_id=ana_id, proyecto_id=p_santa, rol_proyecto="Supervisora"),
        ]
        db.add_all(asignaciones)
        db.commit()

    # ──────────────────────────────────────────────
    # ACTIVIDADES (cronograma de obras)
    # ──────────────────────────────────────────────
    if not db.query(models.Actividad).first():
        actividades = [
            # Proyecto 1 - Edificio Mirador
            models.Actividad(proyecto_id=p_mirador, nombre="Excavación y cimentación", descripcion="Excavación de 2 sótanos, pilotaje y zapatas", responsable_id=miguel_id, fecha_inicio=date(2026, 1, 15), fecha_fin_plan=date(2026, 3, 15), fecha_fin_real=date(2026, 3, 20), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_mirador, nombre="Estructura Nivel 1-5", descripcion="Columnas, vigas y losas del primer bloque", responsable_id=rosa_id, fecha_inicio=date(2026, 3, 20), fecha_fin_plan=date(2026, 5, 30), avance_plan=0, avance_real=65, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_mirador, nombre="Estructura Nivel 6-10", descripcion="Continuación de segundo bloque estructural", responsable_id=rosa_id, fecha_inicio=date(2026, 6, 1), fecha_fin_plan=date(2026, 8, 30), avance_plan=0, avance_real=20, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_mirador, nombre="Instalaciones sanitarias", descripcion="Red de agua fría, caliente y desagüe nivel 1-5", responsable_id=miguel_id, fecha_inicio=date(2026, 5, 1), fecha_fin_plan=date(2026, 6, 30), avance_plan=0, avance_real=40, estado="En proceso", prioridad="Media"),
            models.Actividad(proyecto_id=p_mirador, nombre="Instalaciones eléctricas", descripcion="Cableado, tableros y alumbrado nível 1-5", responsable_id=miguel_id, fecha_inicio=date(2026, 5, 15), fecha_fin_plan=date(2026, 7, 15), avance_plan=0, avance_real=30, estado="En proceso", prioridad="Media"),
            # Proyecto 2 - Planta Industrial
            models.Actividad(proyecto_id=p_planta, nombre="Movimiento de tierras", descripcion="Nivelación y compactación de 5,000 m²", responsable_id=ana_id, fecha_inicio=date(2026, 3, 1), fecha_fin_plan=date(2026, 4, 1), fecha_fin_real=date(2026, 4, 1), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_planta, nombre="Cimentación", descripcion="Zapatas aisladas y conectadas para naves industriales", responsable_id=miguel_id, fecha_inicio=date(2026, 4, 5), fecha_fin_plan=date(2026, 5, 15), avance_plan=0, avance_real=70, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_planta, nombre="Estructura metálica", descripcion="Montaje de 45 toneladas de acero estructural", responsable_id=rosa_id, fecha_inicio=date(2026, 5, 20), fecha_fin_plan=date(2026, 8, 30), avance_plan=0, avance_real=15, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_planta, nombre="Cuarto frío", descripcion="Construcción de cámara frigorífica de 800 m²", responsable_id=miguel_id, fecha_inicio=date(2026, 7, 1), fecha_fin_plan=date(2026, 10, 30), avance_plan=0, avance_real=0, estado="No iniciada", prioridad="Media"),
            # Proyecto 3 - Plaza Sur
            models.Actividad(proyecto_id=p_plaza, nombre="Estructura nivel 1-2", descripcion="Losas, vigas y columnas de niveles 1 y 2", responsable_id=ana_id, fecha_inicio=date(2025, 8, 1), fecha_fin_plan=date(2025, 12, 31), fecha_fin_real=date(2026, 1, 15), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_plaza, nombre="Estructura nivel 3", descripcion="Tercer nivel y azotea", responsable_id=ana_id, fecha_inicio=date(2026, 1, 20), fecha_fin_plan=date(2026, 4, 30), fecha_fin_real=date(2026, 5, 5), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_plaza, nombre="Muros y acabados nivel 1", descripcion="Tabiquería, tarrajeo y pintural nivel 1", responsable_id=luisa_id, fecha_inicio=date(2026, 2, 1), fecha_fin_plan=date(2026, 6, 30), avance_plan=0, avance_real=80, estado="En proceso", prioridad="Media"),
            models.Actividad(proyecto_id=p_plaza, nombre="Instalaciones HVAC", descripcion="Sistema de climatización centralizado", responsable_id=miguel_id, fecha_inicio=date(2026, 4, 1), fecha_fin_plan=date(2026, 8, 30), avance_plan=0, avance_real=45, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_plaza, nombre="Cines — Acabados especiales", descripcion="Acústica, butacas y proyección", responsable_id=rosa_id, fecha_inicio=date(2026, 6, 1), fecha_fin_plan=date(2026, 10, 30), avance_plan=0, avance_real=25, estado="En proceso", prioridad="Alta"),
            # Proyecto 4 - Condominio Los Rosales
            models.Actividad(proyecto_id=p_rosales, nombre="Casas piso 1 al 15", descripcion="Estructura, muros y techado de 15 viviendas", responsable_id=rosa_id, fecha_inicio=date(2025, 6, 1), fecha_fin_plan=date(2025, 12, 31), fecha_fin_real=date(2026, 1, 10), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_rosales, nombre="Casas piso 16-30", descripcion="Estructura de segundo grupo de viviendas", responsable_id=rosa_id, fecha_inicio=date(2026, 1, 15), fecha_fin_plan=date(2026, 5, 31), avance_plan=0, avance_real=85, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_rosales, nombre="Casas piso 31-45", descripcion="Estructura del grupo final", responsable_id=miguel_id, fecha_inicio=date(2026, 4, 1), fecha_fin_plan=date(2026, 8, 31), avance_plan=0, avance_real=60, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_rosales, nombre="Clubhouse y áreas comunes", descripcion="Salón social, piscina y jardinería", responsable_id=luisa_id, fecha_inicio=date(2026, 7, 1), fecha_fin_plan=date(2026, 10, 31), avance_plan=0, avance_real=0, estado="No iniciada", prioridad="Baja"),
            # Proyecto 5 - Torre Pacífico
            models.Actividad(proyecto_id=p_torre, nombre="Excavación y sótano", descripcion="3 niveles subterráneos de estacionamiento", responsable_id=ana_id, fecha_inicio=date(2025, 3, 1), fecha_fin_plan=date(2025, 7, 31), fecha_fin_real=date(2025, 8, 15), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_torre, nombre="Estructura torre", descripcion="Edificio de 22 pisos en concreto postensado", responsable_id=miguel_id, fecha_inicio=date(2025, 8, 20), fecha_fin_plan=date(2026, 6, 30), avance_plan=0, avance_real=55, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_torre, nombre="Fachada ventilada", descripcion="Instalación de paneles de vidrio templado", responsable_id=rosa_id, fecha_inicio=date(2026, 5, 1), fecha_fin_plan=date(2026, 10, 31), avance_plan=0, avance_real=30, estado="En proceso", prioridad="Media"),
            models.Actividad(proyecto_id=p_torre, nombre="Instalaciones MEP", descripcion="Mechanical, electrical y plumbing integral", responsable_id=jorge_id, fecha_inicio=date(2026, 3, 1), fecha_fin_plan=date(2026, 11, 30), avance_plan=0, avance_real=40, estado="En proceso", prioridad="Media"),
            # Proyecto 6 - Hospital
            models.Actividad(proyecto_id=p_hospital, nombre="Estructura etapa II", descripcion="3 niveles adicionales para UCI y quirófanos", responsable_id=miguel_id, fecha_inicio=date(2024, 9, 1), fecha_fin_plan=date(2025, 6, 30), fecha_fin_real=date(2025, 7, 10), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_hospital, nombre="Quirófanos 3 unidades", descripcion="Construcción de 3 quirófanos de última generación", responsable_id=miguel_id, fecha_inicio=date(2025, 7, 15), fecha_fin_plan=date(2025, 12, 31), fecha_fin_real=date(2026, 1, 5), avance_plan=100, avance_real=100, estado="Completada", prioridad="Alta"),
            models.Actividad(proyecto_id=p_hospital, nombre="UCI 12 camas", descripcion="Unidad de cuidados intensivos con sistemas de monitoreo", responsable_id=ana_id, fecha_inicio=date(2026, 1, 10), fecha_fin_plan=date(2026, 5, 31), avance_plan=0, avance_real=70, estado="En proceso", prioridad="Alta"),
            models.Actividad(proyecto_id=p_hospital, nombre="Helipuerto", descripcion="Construcción de plataforma de aeronaves", responsable_id=luisa_id, fecha_inicio=date(2026, 4, 1), fecha_fin_plan=date(2026, 6, 30), avance_plan=0, avance_real=30, estado="En proceso", prioridad="Alta"),
        ]
        db.add_all(actividades)
        db.commit()

    # IDs de actividades para vincular evidencias
    acts = db.query(models.Actividad).all()
    act_map = {}
    for a in acts:
        key = (a.proyecto_id, a.nombre)
        act_map[key] = a.id

    # ──────────────────────────────────────────────
    # PLANOS
    # ──────────────────────────────────────────────
    if not db.query(models.Plano).first():
        planos = [
            # Edificio Mirador
            models.Plano(proyecto_id=p_mirador, nombre="Planta General Nivel 1", tipo="Arquitectónico", numero_plano="AM-ARQ-001", descripcion="Distribución departamentos tipo A y B, vestíbulo y escaleras", estado="Aprobado", archivo_url="/uploads/planos/mirador_planta_n1.pdf", creado_por=miguel_id),
            models.Plano(proyecto_id=p_mirador, nombre="Planta General Nivel 5", tipo="Arquitectónico", numero_plano="AM-ARQ-005", descripcion="Distribución pisos 5 al 15, tipo repetitivo", estado="Aprobado", archivo_url="/uploads/planos/mirador_planta_n5.pdf", creado_por=miguel_id),
            models.Plano(proyecto_id=p_mirador, nombre="Cimentación y Sótano", tipo="Estructural", numero_plano="AM-EST-001", descripcion="Zapatas, pedestales, muros de contención y losas de sótano", estado="Aprobado", archivo_url="/uploads/planos/mirador_cimentacion.pdf", creado_por=miguel_id),
            models.Plano(proyecto_id=p_mirador, nombre="Instalaciones Sanitarias N1-5", tipo="Sanitario", numero_plano="AM-SAN-001", descripcion="Red de agua fría, caliente y desagüe niveles 1-5", estado="Pendiente", archivo_url="/uploads/planos/mirador_sanitario.pdf", creado_por=miguel_id),
            models.Plano(proyecto_id=p_mirador, nombre="Instalaciones Eléctricas N1-5", tipo="Eléctrico", numero_plano="AM-ELE-001", descripcion="Circuitos, tableros, alumbrado y tomacorrientes", estado="Pendiente", archivo_url="/uploads/planos/mirador_electrico.pdf", creado_por=miguel_id),
            # Planta Industrial
            models.Plano(proyecto_id=p_planta, nombre="Layout General Planta", tipo="Arquitectónico", numero_plano="PI-ARQ-001", descripcion="Distribución nueva área de producción de 5,000 m²", estado="Aprobado", archivo_url="/uploads/planos/planta_layout.pdf", creado_por=miguel_id),
            models.Plano(proyecto_id=p_planta, nombre="Estructura Metálica Nave A", tipo="Estructural", numero_plano="PI-EST-001", descripcion="45 toneladas de acero, vigas de 12m de luz", estado="Aprobado", archivo_url="/uploads/planos/planta_estructura.pdf", creado_por=ana_id),
            models.Plano(proyecto_id=p_planta, nombre="Sistema Contra Incendios", tipo="Seguridad", numero_plano="PI-SEG-001", descripcion="Red de rociadores, extores y detectores de humo", estado="Pendiente", archivo_url="/uploads/planos/planta_incendios.pdf", creado_por=miguel_id),
            # Plaza Sur
            models.Plano(proyecto_id=p_plaza, nombre="Nivel 1 — Locales Comerciales", tipo="Arquitectónico", numero_plano="PS-ARQ-101", descripcion="60 locales comerciales, pasillos principales y food court", estado="Aprobado", archivo_url="/uploads/planos/plaza_n1.pdf", creado_por=ana_id),
            models.Plano(proyecto_id=p_plaza, nombre="Nivel 2 — Locales y Oficinas", tipo="Arquitectónico", numero_plano="PS-ARQ-102", descripcion="40 locales, 10 oficinas administrativas", estado="Aprobado", archivo_url="/uploads/planos/plaza_n2.pdf", creado_por=ana_id),
            models.Plano(proyecto_id=p_plaza, nombre="Salas de Cine 1-4", tipo="Acústico", numero_plano="PS-ACU-001", descripcion="Aislamiento acústico, pendiente de piso y proyección", estado="Pendiente", archivo_url="/uploads/planos/plaza_cines.pdf", creado_por=miguel_id),
            # Torre Pacífico
            models.Plano(proyecto_id=p_torre, nombre="Planta Tipo Oficinas", tipo="Arquitectónico", numero_plano="TP-ARQ-001", descripcion="Distribución tipo de oficinas 4-20, 800 m² por nivel", estado="Aprobado", archivo_url="/uploads/planos/torre_planta_tipo.pdf", creado_por=ana_id),
            models.Plano(proyecto_id=p_torre, nombre="Estructura Postensado", tipo="Estructural", numero_plano="TP-EST-001", descripcion="Losas postensadas, columnas y núcleo de ascensores", estado="Aprobado", archivo_url="/uploads/planos/torre_estructura.pdf", creado_por=miguel_id),
            models.Plano(proyecto_id=p_torre, nombre="Fachada Vidrio Templado", tipo="Arquitectónico", numero_plano="TP-ARQ-005", descripcion="Muro cortina de 12 mm, paneles de 2.40 x 1.20 m", estado="Aprobado", archivo_url="/uploads/planos/torre_fachada.pdf", creado_por=miguel_id),
        ]
        db.add_all(planos)
        db.commit()

    planos_list = db.query(models.Plano).all()
    plano_ids = [p.id for p in planos_list]

    # ──────────────────────────────────────────────
    # VERSIONES DE PLANOS
    # ──────────────────────────────────────────────
    if not db.query(models.VersionPlano).first() and planos_list:
        versiones = [
            models.VersionPlano(plano_id=plano_ids[0], version="1.0", archivo_url="/uploads/planos/mirador_planta_n1_v1.pdf", cambios="Versión inicial", modificado_por=miguel_id),
            models.VersionPlano(plano_id=plano_ids[0], version="2.0", archivo_url="/uploads/planos/mirador_planta_n1_v2.pdf", cambios="Corrección en ubicación de escaleras de emergencia", modificado_por=miguel_id),
            models.VersionPlano(plano_id=plano_ids[6], version="1.0", archivo_url="/uploads/planos/planta_estructura_v1.pdf", cambios="Versión inicial", modificado_por=ana_id),
            models.VersionPlano(plano_id=plano_ids[6], version="1.1", archivo_url="/uploads/planos/planta_estructura_v1.1.pdf", cambios="Refuerzo en vigas de grúa pórtico", modificado_por=miguel_id),
            models.VersionPlano(plano_id=plano_ids[8], version="1.0", archivo_url="/uploads/planos/plaza_n1_v1.pdf", cambios="Aprobado por municipalidad", modificado_por=ana_id),
            models.VersionPlano(plano_id=plano_ids[11], version="1.0", archivo_url="/uploads/planos/torre_planta_tipo_v1.pdf", cambios="Versión inicial LEED", modificado_por=ana_id),
            models.VersionPlano(plano_id=plano_ids[11], version="2.0", archivo_url="/uploads/planos/torre_planta_tipo_v2.pdf", cambios="Optimización de áreas comunes y accesibilidad", modificado_por=ana_id),
        ]
        db.add_all(versiones)
        db.commit()

    # ──────────────────────────────────────────────
    # EVIDENCIAS FOTOGRÁFICAS
    # ──────────────────────────────────────────────
    if not db.query(models.Evidencia).first():
        evidencias = [
            # Edificio Mirador
            models.Evidencia(proyecto_id=p_mirador, actividad_id=act_map.get((p_mirador, "Excavación y cimentación")), titulo="Excavación para sótano nivel -2", descripcion="Vista general de excavación a 8 metros de profundidad con sistema de anclajes provisionales", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 1, 20, 9, 30), subido_por=rosa_id, ubicacion="Sector A, Edificio Mirador", tags="excavacion,sotano,cimentacion"),
            models.Evidencia(proyecto_id=p_mirador, actividad_id=act_map.get((p_mirador, "Excavación y cimentación")), titulo="Colocación de pilotaje", descripcion="Encofrado de pilotes de 12m de profundidad, acero certificado ASTM A615", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 2, 5, 14, 15), subido_por=rosa_id, ubicacion="Sector B, Edificio Mirador", tags="pilotes,acero,cimentacion"),
            models.Evidencia(proyecto_id=p_mirador, actividad_id=act_map.get((p_mirador, "Estructura Nivel 1-5")), titulo="Vaciado de losa nivel 1", descripcion="Vaciado de concreto f'c=280 kg/cm² en losa aligerada de 20cm", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 3, 25, 11, 0), subido_por=rosa_id, ubicacion="Nivel 1, Edificio Mirador", tags="concreto,losa,vaciado"),
            models.Evidencia(proyecto_id=p_mirador, actividad_id=act_map.get((p_mirador, "Instalaciones sanitarias")), titulo="Instalación de tuberías de agua fría", descripcion="Tubería CPVC de 3/4 a 2 pulgadas, pruebas hidráulicas aprobadas", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 4, 10, 16, 45), subido_por=miguel_id, ubicacion="Nivel 3, Edificio Mirador", tags="sanitario,tuberia,agua"),
            # Planta Industrial
            models.Evidencia(proyecto_id=p_planta, actividad_id=act_map.get((p_planta, "Movimiento de tierras")), titulo="Nivelación y compactación terminada", descripcion="Compactación al 95% proctor modificado verificada por laboratorio externo", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1586766458088-31a87fa2e2d5?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 4, 1, 10, 0), subido_por=ana_id, ubicacion="Área norte, Planta Industrial", tags="nivelacion,compactacion,suelo"),
            models.Evidencia(proyecto_id=p_planta, actividad_id=act_map.get((p_planta, "Cimentación")), titulo="Zapatas aisladas terminadas", descripcion="Encofrado y vaciado de 24 zapatas de concreto f'c=210 kg/cm²", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 4, 20, 8, 30), subido_por=luisa_id, ubicacion="Nave A, Planta Industrial", tags="zapatas,concreto,cimentacion"),
            models.Evidencia(proyecto_id=p_planta, actividad_id=act_map.get((p_planta, "Estructura metálica")), titulo="Montaje de vigas principales", descripcion="Izaje de viga de 12m de longitud, 850 kg, con grúa de 100 toneladas", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 5, 5, 15, 20), subido_por=rosa_id, ubicacion="Nave A, Planta Industrial", tags="acero,montaje,izaje"),
            # Plaza Sur
            models.Evidencia(proyecto_id=p_plaza, actividad_id=act_map.get((p_plaza, "Estructura nivel 1-2")), titulo="Losa nivel 2 terminada", descripcion="Vaciado de 1,200 m² de losa maciza de concreto con fibras metálicas", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2025, 12, 20, 12, 0), subido_por=luisa_id, ubicacion="Nivel 2, Centro Comercial Plaza Sur", tags="losa,concreto,estructura"),
            models.Evidencia(proyecto_id=p_plaza, actividad_id=act_map.get((p_plaza, "Muros y acabados nivel 1")), titulo="Tabiquería de drywall nivel 1", descripcion="Instalación de 850 m² de tabiquería con lana de vidrio de 50mm", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 4, 5, 9, 0), subido_por=luisa_id, ubicacion="Nivel 1, Locales 1-60", tags="tabiqueria,drywall,acabados"),
            models.Evidencia(proyecto_id=p_plaza, actividad_id=act_map.get((p_plaza, "Cines — Acabados especiales")), titulo="Aislamiento acústico Sala 1", descripcion="Instalación de paneles acústicos de 60dB, piso técnico elevado", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 5, 2, 14, 30), subido_por=rosa_id, ubicacion="Sala Cine 1, Nivel 3", tags="acustica,cine,butacas"),
            # Torre Pacífico
            models.Evidencia(proyecto_id=p_torre, titulo="Fachada vidrio templado nivel 4", descripcion="Paneles de vidrio laminado de 12mm instalados, sellador estructural Dow Corning", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 5, 3, 11, 15), subido_por=ana_id, ubicacion="Nivel 4, Torre Pacífico", tags="fachada,vidrio,leed"),
            models.Evidencia(proyecto_id=p_torre, titulo="Núcleo de ascensores terminado", descripcion="3 ascensores de alta velocidad (3.5 m/s), guías y contrapeso instalados", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 4, 28, 10, 0), subido_por=jorge_id, ubicacion="Caja de ascensores, Torre Pacífico", tags="ascensores,instalaciones,mep"),
            # Hospital
            models.Evidencia(proyecto_id=p_hospital, actividad_id=act_map.get((p_hospital, "Quirófanos 3 unidades")), titulo="Quirófano 1 terminado", descripcion="Piso vinílico antimagnético, techo hermético, lámpara quirófana LED de 160,000 lux", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 1, 10, 8, 0), subido_por=luisa_id, ubicacion="Quirófano 1, Nivel 1", tags="quiroro,acabados,equipamiento"),
            models.Evidencia(proyecto_id=p_hospital, actividad_id=act_map.get((p_hospital, "UCI 12 camas")), titulo="UCI avance eléctrico", descripcion="Instalación de 48 tomas de gases medicinales, 96 circuitos eléctricos dedicados", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 5, 1, 13, 45), subido_por=miguel_id, ubicacion="UCI, Nivel 2", tags="uci,gases medicinales,instalaciones"),
            models.Evidencia(proyecto_id=p_hospital, actividad_id=act_map.get((p_hospital, "Helipuerto")), titulo="Helipuerto armado de acero", descripcion="Malla electrosoldada y acabados de la plataforma de 20x20 metros", tipo="Imagen", archivo_url="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800", fecha_captura=datetime(2026, 5, 4, 16, 0), subido_por=luisa_id, ubicacion="Azotea, Hospital Regional", tags="helipuerto,acero,plataforma"),
        ]
        db.add_all(evidencias)
        db.commit()

    # ──────────────────────────────────────────────
    # DOCUMENTOS
    # ──────────────────────────────────────────────
    if not db.query(models.Document).first():
        documentos = [
            # Edificio Mirador
            models.Document(proyecto_id=p_mirador, nombre="Contrato de Obra N° 2026-001", tipo="Legal", descripcion="Contrato firmado con Inmobiliaria ABC S.A.C. por USD 1,500,000", archivo_url="/uploads/documentos/mirador_contrato.pdf", tamaño=2048, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2026, 1, 10), aprobado_por=admin_id),
            models.Document(proyecto_id=p_mirador, nombre="Licencia de Construcción Municipal", tipo="Administrativo", descripcion="Licencia N° LC-2026-0456 otorgada por Municipalidad de San Isidro", archivo_url="/uploads/documentos/mirador_licencia.pdf", tamaño=512, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2026, 1, 12), aprobado_por=admin_id),
            models.Document(proyecto_id=p_mirador, nombre="Estudio de Mecánica de Suelos", tipo="Técnico", descripcion="EMS a 20m de profundidad, capacidad portante 2.5 kg/cm²", archivo_url="/uploads/documentos/mirador_ems.pdf", tamaño=4096, estado="Aprobado", version="1.0", subido_por=miguel_id, fecha_aprob=datetime(2026, 1, 8), aprobado_por=admin_id),
            models.Document(proyecto_id=p_mirador, nombre="Presupuesto Detallado de Obra", tipo="Financiero", descripcion="Presupuesto desglosado por partidas con BIM 5D", archivo_url="/uploads/documentos/mirador_presupuesto.xlsx", tamaño=1536, estado="Aprobado", version="2.0", subido_por=jorge_id, fecha_aprob=datetime(2026, 1, 14), aprobado_por=admin_id),
            models.Document(proyecto_id=p_mirador, nombre="Póliza de Seguro Todo Riesgo", tipo="Legal", descripcion="Cobertura de USD 2,000,000 por daños a terceros y riesgos de obra", archivo_url="/uploads/documentos/mirador_seguro.pdf", tamaño=768, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2026, 1, 11), aprobado_por=admin_id),
            # Planta Industrial
            models.Document(proyecto_id=p_planta, nombre="Contrato de Obra N° 2026-015", tipo="Legal", descripcion="Contrato con Industrias XYZ S.A. por USD 2,800,000", archivo_url="/uploads/documentos/planta_contrato.pdf", tamaño=2560, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2026, 2, 20), aprobado_por=admin_id),
            models.Document(proyecto_id=p_planta, nombre="Certificado de Impacto Ambiental", tipo="Administrativo", descripcion="Certificación ambiental vigente otorgada por MINAM", archivo_url="/uploads/documentos/planta_certificado_ambiental.pdf", tamaño=1024, estado="Aprobado", version="1.0", subido_por=ana_id, fecha_aprob=datetime(2026, 2, 25), aprobado_por=admin_id),
            models.Document(proyecto_id=p_planta, nombre="Plan de Seguridad y Salud Ocupacional", tipo="Técnico", descripcion="Plan SSO conforme a Ley 29783, 45 procedimientos documentados", archivo_url="/uploads/documentos/planta_sso.pdf", tamaño=3072, estado="Aprobado", version="1.0", subido_por=ana_id, fecha_aprob=datetime(2026, 2, 28), aprobado_por=admin_id),
            models.Document(proyecto_id=p_planta, nombre="Propuesta de Cambio Estructural", tipo="Técnico", descripcion="Modificación de diseño para soportar grúa pórtico de 10 toneladas", archivo_url="/uploads/documentos/planta_cambio_estructural.pdf", tamaño=896, estado="Pendiente", version="1.0", subido_por=miguel_id),
            # Plaza Sur
            models.Document(proyecto_id=p_plaza, nombre="Contrato de Obra N° 2025-089", tipo="Legal", descripcion="Contrato con Grupo Comercial del Sur S.A. por USD 8,500,000", archivo_url="/uploads/documentos/plaza_contrato.pdf", tamaño=3584, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2025, 7, 15), aprobado_por=admin_id),
            models.Document(proyecto_id=p_plaza, nombre="Licencia de Funcionamiento", tipo="Administrativo", descripcion="Licencia municipal para centro comercial de 120 locales", archivo_url="/uploads/documentos/plaza_licencia.pdf", tamaño=640, estado="Pendiente", version="1.0", subido_por=ana_id),
            models.Document(proyecto_id=p_plaza, nombre="Estudio de Tráfico Vehicular", tipo="Técnico", descripcion="Análisis de impacto vial en Panamericana Sur, hora pico 450 veh/h", archivo_url="/uploads/documentos/plaza_trafico.pdf", tamaño=2048, estado="Aprobado", version="1.0", subido_por=miguel_id, fecha_aprob=datetime(2025, 7, 20), aprobado_por=admin_id),
            # Torre Pacífico
            models.Document(proyecto_id=p_torre, nombre="Certificación LEED Gold", tipo="Técnico", descripcion="Documentación para certificación LEED Gold, puntaje estimado 72/110", archivo_url="/uploads/documentos/torre_leed.pdf", tamaño=5120, estado="Pendiente", version="1.0", subido_por=ana_id),
            models.Document(proyecto_id=p_torre, nombre="Contrato de Obra N° 2025-042", tipo="Legal", descripcion="Contrato con Grupo Empresarial Pacífico S.A. por USD 12,000,000", archivo_url="/uploads/documentos/torre_contrato.pdf", tamaño=4096, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2025, 2, 15), aprobado_por=admin_id),
            models.Document(proyecto_id=p_torre, nombre="Plan de Mantenimiento Preventivo", tipo="Técnico", descripcion="Programa de mantenimiento de ascensores, HVAC y generador", archivo_url="/uploads/documentos/torre_mantenimiento.pdf", tamaño=1280, estado="Aprobado", version="1.0", subido_por=jorge_id, fecha_aprob=datetime(2025, 3, 1), aprobado_por=admin_id),
            # Hospital
            models.Document(proyecto_id=p_hospital, nombre="Contrato Gobierno Regional N° 2024-156", tipo="Legal", descripcion="Contrato con GORE La Libertad por USD 25,000,000", archivo_url="/uploads/documentos/hospital_contrato.pdf", tamaño=6144, estado="Aprobado", version="1.0", subido_por=admin_id, fecha_aprob=datetime(2024, 8, 15), aprobado_por=admin_id),
            models.Document(proyecto_id=p_hospital, nombre="Equipamiento Médico — Cotización", tipo="Financiero", descripcion="Cotización de 12 camas UCI, 3 lámparas quirúrgicas y monitores", archivo_url="/uploads/documentos/hospital_equipamiento.xlsx", tamaño=1792, estado="Aprobado", version="1.0", subido_por=jorge_id, fecha_aprob=datetime(2025, 1, 10), aprobado_por=admin_id),
            models.Document(proyecto_id=p_hospital, nombre="Protocolo de Bioseguridad", tipo="Técnico", descripcion="Protocolo aprobado por MINSA para UCI y quirófanos", archivo_url="/uploads/documentos/hospital_bioseguridad.pdf", tamaño=2560, estado="Aprobado", version="2.0", subido_por=miguel_id, fecha_aprob=datetime(2025, 6, 1), aprobado_por=admin_id),
        ]
        db.add_all(documentos)
        db.commit()

    # ──────────────────────────────────────────────
    # NOTIFICACIONES
    # ──────────────────────────────────────────────
    if not db.query(models.Notification).first():
        notificaciones = [
            models.Notification(usuario_id=admin_id, proyecto_id=p_mirador, tipo="Info", titulo="Nuevo Proyecto Asignado", mensaje="Se te ha asignado como responsable del proyecto Edificio Mirador Las Gardenias.", leida=True, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_torre, tipo="Info", titulo="Nuevo Proyecto Asignado", mensaje="Se te ha asignado como Gerente de Proyecto Torre Empresarial Pacífico.", leida=True, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_planta, tipo="Alerta", titulo="Retraso en Actividad", mensaje="La actividad 'Cimentación' de Planta Industrial Norte presenta 5 días de retraso respecto al cronograma.", leida=False, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_mirador, tipo="Alerta", titulo="Excavación Retrasada", mensaje="La actividad 'Excavación y cimentación' finalizó 5 días después de lo planificado.", leida=False, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_santa, tipo="Advertencia", titulo="Proyecto en Pausa", mensaje="El proyecto Residencial Santa Patricia ha sido puesto en pausa. Pendiente reestructuración financiera.", leida=False, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_plaza, tipo="Éxito", titulo="Hito Completado", mensaje="La estructura del Centro Comercial Plaza Sur ha sido completada. Próximo hito: acabados nivel 1.", leida=True, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_hospital, tipo="Info", titulo="Quirófanos Terminados", mensaje="Los 3 quirófanos adicionales del Hospital Regional del Norte han sido completados satisfactoriamente.", leida=True, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_torre, tipo="Info", titulo="Avance de Fachada", mensaje="La fachada de vidrio templado del nivel 4 de Torre Pacífico ha sido instalada correctamente.", leida=False, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_rosales, tipo="Éxito", titulo="Casas 1-15 Terminadas", mensaje="Las primeras 15 casas del Condominio Los Rosales han sido completadas y entregadas.", leida=True, url_enlace="/proyectos"),
            models.Notification(usuario_id=admin_id, proyecto_id=p_hospital, tipo="Alerta", titulo="UCI en Progreso", mensaje="La UCI de 12 camas del Hospital Regional lleva 70% de avance. Pendiente instalación de gases medicinales.", leida=False, url_enlace="/proyectos"),
            models.Notification(usuario_id=ana_id, proyecto_id=p_planta, tipo="Info", titulo="Nueva Evidencia", mensaje="Se ha registrado nueva evidencia fotográfica en Planta Industrial Norte: Montaje de vigas principales.", leida=False, url_enlace="/evidencias"),
            models.Notification(usuario_id=ana_id, proyecto_id=p_plaza, tipo="Info", titulo="Documento Pendiente", mensaje="El certificado de impacto ambiental de Plaza Sur requiere actualización anual.", leida=False, url_enlace="/documentos"),
            models.Notification(usuario_id=miguel_id, proyecto_id=p_mirador, tipo="Info", titulo="Plano Aprobado", mensaje="El plano AM-ARQ-001 Planta General Nivel 1 ha sido aprobado por el cliente.", leida=True, url_enlace="/proyectos"),
            models.Notification(usuario_id=miguel_id, proyecto_id=p_hospital, tipo="Alerta", titulo="Helipuerto en Ejecución", mensaje="El helipuerto del Hospital Regional lleva 30% de avance. Verificar cumplimiento de normativa DGAC.", leida=False, url_enlace="/proyectos"),
            models.Notification(usuario_id=rosa_id, proyecto_id=p_mirador, tipo="Info", titulo="Vaciado Completado", mensaje="El vaciado de losa nivel 1 del Edificio Mirador ha sido completado exitosamente.", leida=True, url_enlace="/evidencias"),
            models.Notification(usuario_id=jorge_id, proyecto_id=p_torre, tipo="Info", titulo="Presupuesto Actualizado", mensaje="El presupuesto de Torre Pacífico ha sido actualizado a la versión 2.0 con ajustes en instalaciones MEP.", leida=False, url_enlace="/documentos"),
        ]
        db.add_all(notificaciones)
        db.commit()

    db.close()

if __name__ == "__main__":
    seed_db()
    print("Database seeded with comprehensive test data!")
